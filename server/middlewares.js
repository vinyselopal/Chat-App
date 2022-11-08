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

module.exports = { authMiddleware, checkLoggedinMiddleware, logoutMiddleware }
