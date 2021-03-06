/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */


 const path = require("path");
 
 require("dotenv").config();

 const {
   DATABASE_URL = "postgres://arlezlqp:URIPrI-U_QN8fcQm4kxBWcmM1kC_9ItY@lallah.db.elephantsql.com/arlezlqp",
   DATABASE_URL_DEVELOPMENT = "postgres://arlezlqp:URIPrI-U_QN8fcQm4kxBWcmM1kC_9ItY@lallah.db.elephantsql.com/arlezlqp",
   DATABASE_URL_TEST = "postgres://arlezlqp:URIPrI-U_QN8fcQm4kxBWcmM1kC_9ItY@lallah.db.elephantsql.com/arlezlqp",
   DATABASE_URL_PREVIEW = "postgres://arlezlqp:URIPrI-U_QN8fcQm4kxBWcmM1kC_9ItY@lallah.db.elephantsql.com/arlezlqp",
   DEBUG,
 } = process.env;
 console.log(DATABASE_URL_PREVIEW)
 module.exports = {
   development: {
     client: "postgresql",
     pool: { min: 1, max: 5 },
     connection: DATABASE_URL_DEVELOPMENT,
     migrations: {
       directory: path.join(__dirname, "src", "db", "migrations"),
     },
     seeds: {
       directory: path.join(__dirname, "src", "db", "seeds"),
     },
     debug: !!DEBUG,
   },
   test: {
     client: "postgresql",
     pool: { min: 1, max: 5 },
     connection: DATABASE_URL_TEST,
     migrations: {
       directory: path.join(__dirname, "src", "db", "migrations"),
     },
     seeds: {
       directory: path.join(__dirname, "src", "db", "seeds"),
     },
     debug: !!DEBUG,
   },
   preview: {
     client: "postgresql",
     pool: { min: 1, max: 5 },
     connection: DATABASE_URL_PREVIEW,
     migrations: {
       directory: path.join(__dirname, "src", "db", "migrations"),
     },
     seeds: {
       directory: path.join(__dirname, "src", "db", "seeds"),
     },
     debug: !!DEBUG,
   },
   production: {
     client: "postgresql",
     pool: { min: 1, max: 5 },
     connection: DATABASE_URL,
     migrations: {
       directory: path.join(__dirname, "src", "db", "migrations"),
     },
     seeds: {
       directory: path.join(__dirname, "src", "db", "seeds"),
     },
     debug: !!DEBUG,
   },
 };
