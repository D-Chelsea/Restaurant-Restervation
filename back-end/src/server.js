const PORT = process.env.PORT || 6001

const app = require('./app')
const knex = require('./db/connection')

knex.migrate
  .latest()
  .then((migrations) => {
    console.log('migrations', migrations)
    app.listen(PORT, listener)
  })


function listener() {
  console.log(`Listening on Port ${PORT}!`)
}
