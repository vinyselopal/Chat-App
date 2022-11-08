const usersSchema = '"user_name" text, user_password text, user_id SERIAL NOT NULL'
const messagesSchema = 'message text, timestamp text, user_name text'

module.exports = { usersSchema, messagesSchema }
