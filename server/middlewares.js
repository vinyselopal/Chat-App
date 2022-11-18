require('dotenv').config()
const jwt =  require('jsonwebtoken')
function authMiddleware (req, res, next) {
  if (req.session.userName) {
    console.log(req.session)
    next()
    console.log(req.session)
  } else res.redirect('/api/login')
}

function checkLoggedinMiddleware (req, res, next) {
  if (!req.session.userName) {
    console.log('am i here?')
    next()
  } else {
    res.redirect('/room')
  }
}

function logoutMiddleware (req, res, next) {
  console.log('in logout')
  console.log(req.session.userName)
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.end()
}

function jwtAuthMiddleware (socket, next) {
  console.log('in jwt mw: socket.handshake.auth.token', socket.handshake.auth.token)
  if (socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
        return next(new Error('Authentication error'))

      }
      console.log('not in err', decoded)

      socket.userName = decoded.user_name
      socket.userID = decoded.user_id
      next()
    })
  }
}

module.exports = { authMiddleware, checkLoggedinMiddleware, logoutMiddleware, jwtAuthMiddleware }
