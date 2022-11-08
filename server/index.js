const { PORT } = require('./config.js')
const sessions = require('express-session')
const path = require('path')
const cors = require("cors")
const express = require('express')
const app = express()

const http = require('http').createServer(app)
const socketio = require('socket.io')

const { initDB } = require('./database/init.js')

const { registerRouter } = require('./routes/registerRouter.js')
const { loginRouter } = require('./routes/loginRouter.js')

const { getMessagesFn, insertMessageFn } = require('./utils')
const {
  authMiddleware,
  checkLoggedinMiddleware,
  logoutMiddleware
} = require('./middlewares.js')

const io = socketio(http, {
  cors: { origin: '*' } // need a better fix for cors errors
})

initDB()

io.on('connection', async (socket) => {
  console.log('a user connected')

  const messages = await getMessagesFn()
  io.emit('messages', messages)
  console.log('after fetching all the messages')

  socket.on('message', (msg) => {
    console.log('new message', msg)

    insertMessageFn(msg)
    io.emit('message', msg)
  })
})
app.use(cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
}))
app.use(sessions({
  secret: 'abc',
  cookie: {
    maxAge: 3600000
  },
  resave: true,
  saveUninitialized: false
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', express.static(path.join(__dirname, '/public/mainPage')))

app.use('/static/login_page', 
checkLoggedinMiddleware, 
express.static(path.join(__dirname, '/public/loginPage')))

app.use('/static/room', authMiddleware, express.static(path.join(__dirname, '/public/room')))
app.use('/static/register_page', express.static(path.join(__dirname, '/public/registerPage')))

app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use('/api/logout', logoutMiddleware)

http.listen(PORT, () => console.log('listening on http://localhost:8000'))
