const { Pool } = require('pg')
const { createUsersTable, createMessagesTable, createRoomsTable } = require('./queries')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  // user: 'postgres',
  // host: 'localhost',
  // database: 'chat_app',
  // post: 5432
})

async function initDB () {
  await pool.query(createUsersTable)
  await pool.query(createRoomsTable)
  await pool.query(createMessagesTable)
}

module.exports = { initDB, pool }
