const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const reservationService = require("../reservations/reservations.service")


const validProperties = ["capacity", "table_name"]

//checking if the Table has all requred fields
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body
  if (!data) {
    return next({
      status: 400,
      message: "requires request data",
    });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `requires ${property}`,
      });
    }

    if (
      (property === "capacity" && data.capacity < 1) ||
      (property === "capacity" && !Number.isInteger(data.capacity))
    ) {
      return next({
        status: 400,
        message: `${property} required to be a number of 1 or greater`,
      });
    }

    if (property === "table_name" && data.table_name.length <= 1) {
      return next({
        status: 400,
        message: `${property} required to be at least 2 characters in length`,
      });
    }
  });
  next();
}
//checks if table at table ID is found
async function tableExists(req, res, next) {
  const { table_id } = req.params
  const table = await service.read(table_id)
  if (table) {
    res.locals.table = table
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id ? table_id : ""} Not Found`,
  })
}
//table id is a valid Id
async function validId(req, res, next) {
  const { data } = req.body
  if (!data) {
    return next({
      status: 400,
      message: `requires request data`,
    })
  }
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: `Requires reservation_id property`,
    })
  }
  next()
}

//checks the reservation Id that corresponds to the table
async function validReservationId(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} Not Found`,
  })
}

//checks if the table can take the amount of people for the reservation
function validTable(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message:
        "Table does not have sufficient capacity to handle this reservation",
    })
  }
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is occupied!",
    })
  }
  next()
}
//chekcs the occupied status of the table
function Occupied(req, res, next) {
  const table = res.locals.table
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: "Table is not occupied!",
    })
  }
  next()
}

//checks if the thable is already seated
function checkSeated(req, res, next) {
  const status = res.locals.reservation.status
  if (status === 'seated') {
      return next({
          status: 400,
          message: `The reservation you selected is already seated.`
      })
  }
  next()
}

//updates the table
async function update(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const table = res.locals.table;
  const updatedTable = {
    ...table,
    reservation_id: reservation_id,
  };
  reservationService.updateTables(reservation_id, "seated");
  service
    .update(updatedTable)
    .then((data) => res.json({ data }))
    .catch(next)
}

//reads the the table at tableId
function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data })
}

//lists the tables
async function list(req, res) {
  const data = await service.list();
  res.json({ data })
}

//creates a new table
async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })  
}

//destroys a table and updates the status to finished
async function destroy(req, res, next) {
  const table = res.locals.table;
  const clearedTable = {
    ...table,
    reservation_id: null,
  };
  reservationService.updateTables(table.reservation_id, "finished");
  service
    .update(clearedTable)
    .then((data) => res.json({ data }))
    .catch(next)
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create:[
    hasValidProperties,
    asyncErrorBoundary(create)
  ],
  read: [ asyncErrorBoundary(tableExists), read],
  update:[
    asyncErrorBoundary(tableExists),
    validId,
    validReservationId,
    validTable,
    checkSeated,
    asyncErrorBoundary(update)
  ],
  destroy: [asyncErrorBoundary(tableExists), asyncErrorBoundary(Occupied), destroy]
};