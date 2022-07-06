const knex = require("../db/connection");


function list() {
  return knex("tables").select("*")
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((created) => created[0]);
}

async function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

async function update(updatedTable) {
  return knex("tables")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updated) => updated[0]);
}

module.exports = {
    list,
    create,
    read,
    update,
  }