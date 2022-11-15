// const { PORT } = require('./config.js')
PORT = process.env.PORT || 8000

const sessions = require('express-session')
const path = require('path')
const cors = require("cors")
const express = require('express')

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

const app = express()
const http = require('http').createServer(app)


const io = socketio(http, {
  cors: { origin: '*' } // need a better fix for cors errors
})

initDB()
io.use((socket, next) => {
  console.log('io middleware')

  const userName = socket.handshake.auth.userName
  const userID = socket.handshake.auth.userID

  if (!userName) {
    console.log('no userName')
    return next(new Error("invalid username"))
  }

  socket.userName = userName
  socket.userID = userID

  next() 
})

// users array stores the list of users will be shared to the client
let users = [];

io.on('connection', async (socket) => {
  socket.join(socket.id) // for private messaging reference
  console.log('a user connected', socket.id)

  for (let [socketID, socket] of io.of("/").sockets) {

    if (users.find(a => a.userName === socket.userName)) {

      console.log('matched, hence skipping the addition')
      continue

    }

    users.push({
      socketID,
      userID: socket.userID, //changed from id to this
      userName: socket.userName,
    })
  } 

  console.log('users', users)
  
  io.emit("user connected", {
    userID: socket.userID,
    userName: socket.userName
  })

  socket.emit("users", users)

  const messages = await getMessagesFn()
  console.log('messages', messages)

  // selecting messages to send to each individual users
  for (user of users) { 
    
    // can handle on database
    const messagesForCurrentUser = messages.filter(
      msg => msg.user_name === user.userName || 
      msg.recipient === user.userID || 
      msg.room_id === 'general'
    )
    socket.to(user.socketID).emit('messages', messagesForCurrentUser)
  }
  io.emit('messages', messages)

  socket.on("private message", ({content, userID}) => {
    console.log("private message")

    to = users.find(a => a.userID ===userID).socketID

    socket.to(to).emit("private message", {
      content,
      from: socket.userName
    })

    insertMessageFn(content)
  })

  socket.on('disconnect', () => {

    console.log('socket disconnected')

    users = users.filter(a => a.socketID !== socket.id)
    socket.emit('new users', users)
  })

  socket.on('message', (msg) => {

    console.log('in message')

    insertMessageFn(msg)
    io.emit('message', msg) // even to the sender socket
  })
})

// for allowing cross access to the url
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

// ----------- heroku deploy ------------- // To serve static build files from client

const _dirname1 = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname1, '/client/build')))
  app.get('*', (req, res) => res.sendFile(path.resolve(
    _dirname, 
    'frontend', 
    'build', 
    'index.html'
    ))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running')
  })
}

// ------------- heroku deploy ------------- //

app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use('/api/logout', logoutMiddleware)

http.listen(PORT, () => console.log('listening on http://localhost:8000'))
