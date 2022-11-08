const { Pool } = require('pg')
const { createUsersTable, createMessagesTable } = require('./queries')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chat_app',
  post: 5432
})

async function initDB () {
  await pool.query(createUsersTable)
  await pool.query(createMessagesTable)
}

module.exports = { initDB, pool }
