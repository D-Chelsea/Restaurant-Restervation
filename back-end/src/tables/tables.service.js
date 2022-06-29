const knex = require("../db/connection")
const table = "tables";

async function list() {
  return knex(table).select("*").orderBy("table_name");
}

module.exports = {
    list,
  }