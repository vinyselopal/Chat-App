const { getMessagesQuery, insertMessageQuery } = require('./database/queries')
const { getUser, checkUserName } = require('./database/queries')
const { pool } = require('./database/init')

async function validateUserName (user_name) {
    const response = await pool.query(checkUserName, [user_name])
    return response.rows.length ? false : true
}

function validatePassword (password) {
  // if (password.length < 8) return 'password too short' 
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  if (!regex.test(password)) return 'password invalid' // semantic meaning not the job
  return 'valid'
}
async function validateUserName (user_name) {
  const response = await pool.query(checkUserName, [user_name])
  return response.rows.length ? false : true
}
async function loginCreds (body) {
  const response = await pool.query(getUser, [body.userName])
  const creds = response.rows // send cookies rather than creds to front end
  console.log(creds[0])
  return creds[0] // unique constraint on user name
}

async function getMessagesFn () {
  const messages = (await pool.query(getMessagesQuery)).rows // db model
  return messages
}

async function insertMessageFn (msg) {
  await pool.query(insertMessageQuery, [msg.message, msg.timestamp, msg.user_id, msg.room_id, msg.user_name, msg.recipient])
}
module.exports = { validatePassword, loginCreds, getMessagesFn, insertMessageFn, validateUserName }
