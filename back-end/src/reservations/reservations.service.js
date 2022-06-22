const knex = require("../db/connection")

function list() {
    return knex("reservations").select("*")
}
function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createRecords) => createRecords[0]);
};
module.exports = {
    list,
    create

}