const knex = require("../db/connection")

function list() {
  return knex("reservations").select("*")
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
      .orderBy("reservation_date");
  }

function listByDate(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc");
  }

module.exports = {
    list,
    create,
    read,
    listByMobileNumber,
    listByDate,
}