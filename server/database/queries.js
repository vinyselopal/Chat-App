const { usersSchema, messagesSchema } = require('./schemas')

const createTable = (tableName, schema) => {
  return `CREATE 
    TABLE 
    IF NOT EXISTS 
    ${tableName} ( ${schema} );`
}

const createUsersTable = createTable('users', [usersSchema])
const createMessagesTable = createTable('user_messages', [messagesSchema])

const insertUser = 'INSERT INTO "users" ("user_name", user_password) VALUES ($1, $2);'
const getUser = 'SELECT * from users WHERE "user_name"=$1;'
const getMessagesQuery = 'SELECT * from user_messages;'
const insertMessageQuery = 'INSERT INTO "user_messages" (message, timestamp, user_name) VALUES ($1, $2, $3); '
const checkUserName = 'SELECT * from users WHERE "user_name"=$1'

module.exports = { createUsersTable, createMessagesTable, insertUser, getUser, getMessagesQuery, insertMessageQuery, checkUserName }
