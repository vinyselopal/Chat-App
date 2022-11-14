const { usersSchema, messagesSchema, roomsSchema } = require('./schemas')

const createTable = (tableName, schema) => {
  return `CREATE 
    TABLE 
    IF NOT EXISTS 
    ${tableName} ( ${schema} );`
}

const createUsersTable = createTable('users', [usersSchema])
const createRoomsTable = createTable('rooms', [roomsSchema])
const createMessagesTable = createTable('messages', [messagesSchema])

const insertUser = 'INSERT INTO users (user_name, user_password) VALUES ($1, $2);'
const getUser = 'SELECT * from users WHERE user_name=$1;'
const getMessagesQuery = 'SELECT * from messages;'
const insertMessageQuery = 'INSERT INTO messages (message, timestamp, user_id, room_id, user_name, recipient) VALUES ($1, $2, $3, $4, $5, $6); '
const checkUserName = 'SELECT * from users WHERE user_name=$1'

module.exports = { createUsersTable, createMessagesTable, createRoomsTable, insertUser, getUser, getMessagesQuery, insertMessageQuery, checkUserName }
