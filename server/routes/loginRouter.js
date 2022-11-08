const express = require('express')
const loginRouter = express.Router()
const { loginCreds } = require('../utils.js')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (req, res) => {
  console.log('in login')
  const creds = await loginCreds(req.body)
  console.log('creds', creds)
  if (creds === undefined) {
    res.status(400).json('invalid username')
    res.end()
  }
  else {
    console.log('pass', req.body.password, 'hash', creds.user_password)
    bcrypt.compare(req.body.password, creds.user_password, function (err, result) {
      if (err) throw err
      if (!result) {
        res.status(400).json(creds)
      } else {
        req.session.userName = req.body.userName
        res.json(creds)
      }
    })
  }
  
})

module.exports = { loginRouter }
