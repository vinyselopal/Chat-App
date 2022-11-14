const usersSchema = 'user_id SERIAL PRIMARY KEY, user_password VARCHAR (255), user_name VARCHAR (255)'
const roomsSchema = 'room_id SERIAL PRIMARY KEY, user_id integer REFERENCES users(user_id)'
const messagesSchema = 'message VARCHAR (255), room_id integer REFERENCES rooms(room_id), user_id integer REFERENCES users(user_id), timestamp VARCHAR (255)'
module.exports = { usersSchema, messagesSchema, roomsSchema }
