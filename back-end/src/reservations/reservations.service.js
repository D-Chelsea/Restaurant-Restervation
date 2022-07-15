const knex = require("../db/connection")

function list() {
  return knex("reservations")
      .select("*")
      .orderBy("reservation_time")
}
function create(reservation) {
    if (!reservation) {
        throw new Error("Reservation is required.");
      }
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createRecords) => createRecords[0]);
};
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
  }

function listByMobileNumber(mobile_number) {
    return knex("reservations")
      .select("*")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date")
  }

function listByDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .whereNot({status: "finished"})
      .orderBy("reservation_time", "asc")
  }
  async function updateTables(reservation_id, status) {
    return knex("reservations")
      .where({ reservation_id })
      .update({ status }, "*")
      .then((updated) => updated[0])
  }
  async function update(reservation) {
    return knex("reservations")
      .where({ reservation_id: reservation.reservation_id })
      .update(reservation, "*")
      .then((updated) => updated[0])
  }
  function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status })
        .then(() => read(reservation_id))
}

module.exports = {
    list,
    create,
    read,
    listByMobileNumber,
    listByDate,
    updateTables,
    update,
    updateStatus,
}