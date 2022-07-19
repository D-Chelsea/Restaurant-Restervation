/**
 * List handler for reservation resources
 */

 const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
 const service = require("./reservations.service")
//Checking if the reservation at the givin Id exists
 async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `reservation_id not found: ${reservation_id}` });
}

//checking if the reservation has all the required fields
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
    return !validFields.has(field)
  }
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};
//checks if the reservation has data
function hasData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "data from the request body is missing.",
    });
  }
  next();
}

//checks for first name in the validation
function hasFirstName(req, res, next) {
  const first_name = req.body.data.first_name;
  if (first_name && first_name !== "") {
    res.locals.first_name = first_name;
    return next()
  }
  next({
    status: 400,
    message: "Property first_name must be included.",
  });
}

//checks for last name in the validation
function hasLastName(req, res, next) {
  const last_name = req.body.data.last_name;
  if (last_name && last_name !== "") {
    res.locals.last_name = last_name;
    return next()
  }
  next({
    status: 400,
    message: "Property last_name must be included.",
  });
}

//checks for mobile number in the validation
function hasMobileNumber(req, res, next) {
  const mobile_number = req.body.data.mobile_number;
  if (mobile_number && mobile_number !== "") {
    res.locals.mobile_number = mobile_number;
    return next()
  }
  next({
    status: 400,
    message: "Property mobile_number must be included.",
  })
}

//checks that the people data isnt emty or a 0
function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if (people && people !== "" && people !== 0) {
    res.locals.people = people;
    return next()
  }
  next({
    status: 400,
    message: "Property people must be included.",
  })
}

//checks that the property is a number
function peopleValidation(req, res, next) {
  if (typeof req.body.data.people !== "number") {
    return next({
      status: 400,
      message: "Property people must be a number.",
    })
  }
  next()
}

//checks that the people data isnt 0
function peopleGreaterThanZero(req, res, next) {
  if (!res.locals.people > 0) {
    return next({
      status: 400,
      message: "Property people must be greater than zero.",
    })
  }
  next()
}

//checks the reservation date isnt an empty string
function hasReservationDate(req, res, next) {
  const reservation_date = req.body.data.reservation_date;
  if (reservation_date && reservation_date !== "") {
    res.locals.reservation_date = reservation_date;
    return next()
  }
  next({
    status: 400,
    message: "Property reservation_date must be included.",
  })
}

//checks if the date isnt a string
function hasValidDate(req, res, next){
  const reservation_date = req.body.data.reservation_date
  let valid = new Date(reservation_date)
  if(valid.toString() != 'Invalid Date'){
    return next();
  }
  next({status:400, message: "reservation_date is not valid"});
}

//checks the reservation time. The RegEx converts to 00:00:00
function hasReservationTime(req, res, next){
  const validTimeRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  const {reservation_time} = req.body.data;
  if (validTimeRegex.test(reservation_time)) {
    return next();
  }
  next({status : 400, message: `reservation_time must be type 'time'`})
}

//check that the reservation is a valid day of the week. reservation wont submit if tuesday or a future day or not durring business hours
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
  )
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    })
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    })
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    })
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    })
  }
  next()
}

//checks the reservation status. This comes from connecting the tables table
function validStatus(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "A new reservation cannot be created with a status of seated or finished",
    })
  }
  next()
}

//checks that the reservation has a status. if something is wrong with this check then check the tables connection
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

//this finished the reservation
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

//lists reservations
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

//create reservatons
async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })  
}
//read reservations at the reservationId
function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

//updates the status of the reservation
async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation
  const { status } = req.body.data
  const data = await service.updateStatus(reservation_id, status)
  res.json({ data })
}

//updates an existing reservaiton
async function update(req, res) {
  const { reservation_id } = res.locals.reservation
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  }
  const data = await service.update(updatedReservation)
  res.json({ data })
}

//deletes reservation
async function destroy(req,res ) {
  const { reservation_id } = res.locals.reservation
  await service.destroy(reservation_id)
  res.sendStatus(204)
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
  delete: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(destroy)
  ]
}
