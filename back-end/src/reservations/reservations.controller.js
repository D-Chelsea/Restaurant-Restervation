/**
 * List handler for reservation resources
 */

 const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
 const service = require("./reservations.service")

 async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `reservation_id not found: ${reservation_id}` });
}

 function hasValidFields(req, res, next) {
  const { data = {} } = req.body
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object.keys(data).filter((field) => {
    return !validFields.has(field);
  }
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};

function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data from the request body is missing.",
    });
  }
  next();
}

function hasFirstName(req, res, next) {
  const first_name = req.body.data.first_name;
  if (first_name && first_name !== "") {
    res.locals.first_name = first_name;
    return next();
  }
  next({
    status: 400,
    message: "Property first_name must be included.",
  });
}
function hasLastName(req, res, next) {
  const last_name = req.body.data.last_name;
  if (last_name && last_name !== "") {
    res.locals.last_name = last_name;
    return next();
  }
  next({
    status: 400,
    message: "Property last_name must be included.",
  });
}
function hasMobileNumber(req, res, next) {
  const mobile_number = req.body.data.mobile_number;
  if (mobile_number && mobile_number !== "") {
    res.locals.mobile_number = mobile_number;
    return next();
  }
  next({
    status: 400,
    message: "Property mobile_number must be included.",
  });
}

function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if (people && people !== "" && people !== 0) {
    res.locals.people = people;
    return next();
  }
  next({
    status: 400,
    message: "Property people must be included.",
  });
}
function peopleValidation(req, res, next) {
  if (typeof req.body.data.people !== "number") {
    return next({
      status: 400,
      message: "Property people must be a gbfhgfhhfgnumber.",
    })
  }
  next();
}
function peopleGreaterThanZero(req, res, next) {
  if (!res.locals.people > 0) {
    return next({
      status: 400,
      message: "Property people must be greater than zero.",
    });
  }
  next();
}

function hasReservationDate(req, res, next) {
  const reservation_date = req.body.data.reservation_date;
  if (reservation_date && reservation_date !== "") {
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: "Property reservation_date must be included.",
  })
}
function hasValidDate(req, res, next){
  const reservation_date = req.body.data.reservation_date
  let valid = new Date(reservation_date)
  if(valid.toString() != 'Invalid Date'){
    return next();
  };
  next({status:400, message: "reservation_date is not valid"});
}

function hasReservationTime(req, res, next){
  const reservation_time = req.body.data.reservation_time
  if(!reservation_time){
    next({status: 400, message: "reservation_time is missing"})
  };
  var military = /^\s*([01]?\d|2[0-3]):[0-5]\d\s*$/i;
  var standard = /^\s*(0?\d|1[0-2]):[0-5]\d(\s+(AM|PM))?\s*$/i;
 
  if(reservation_time.match(military) || reservation_time.match(standard)){
    res.locals.reservation_time = reservation_time

    return next();
  }
  next({status: 400, message: `reservation_time isn't valid ${reservation_time}`})
}

function isValidDay(req, res, next) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    });
  }
  next();
}

function validStatus(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "A new reservation cannot be created with a status of seated or finished",
    });
  }
  next();
}
function hasStatus(req, res, next) {
  const { status } = req.body.data
  const statuses = ['booked', 'seated', 'finished', 'cancelled']
  if (statuses.includes(status)) {
    return next()
  }
  next({
    status: 400,
    message: `Unknown Status: ${status}. Status must be one of ${statuses.join(", ")}.`
  })
}
function checkFinish(req, res, next) {
  const { status } = res.locals.reservation
  if (status === 'finished') {
    return next({
      status: 400,
      message: `A finished reservation cannot be changed.`
    })
  }
  next()
}
async function list(req, res, next) {
  const { date } = req.query
  const { mobile_number } = req.query
  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.listByMobileNumber(mobile_number) });
  } else {
    res.json({ data: await service.list() });
  }
}
async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })  
};

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation
  const { status } = req.body.data
  const data = await service.updateStatus(reservation_id, status)
  res.json({ data })
}
async function update(req, res) {
  const { reservation_id } = res.locals.reservation
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  }
  const data = await service.update(updatedReservation)
  res.json({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasValidFields,
    hasData,
    hasFirstName,
    hasLastName ,
    hasMobileNumber,
    hasPeople,
    peopleValidation,
    peopleGreaterThanZero,
    hasReservationDate,
    hasValidDate,
    hasReservationTime,
    isValidDay,
    validStatus,
    asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasStatus,
    checkFinish,
    asyncErrorBoundary(updateStatus)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationTime,
    hasPeople,
    peopleValidation,
    hasValidFields,
    hasValidDate,
    asyncErrorBoundary(update)
  ],
};
