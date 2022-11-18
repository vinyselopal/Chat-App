const express = require('express')
const loginRouter = express.Router()
const { loginCreds } = require('../utils.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function generateAccessToken (obj) {
  return jwt.sign(obj, process.env.ACCESS_TOKEN, {expiresIn: '3000s'})
}
loginRouter.post('/', async (req, res) => {
  console.log('in login')
  const creds = await loginCreds(req.body)
  if (creds === undefined) {
    res.status(400).json('invalid username')
    res.end()
  }
  else {
    bcrypt.compare(req.body.password, creds.user_password, function (err, result) {
      if (err) throw err
      if (!result) {
        res.status(400).json(creds)
      } else {
        const accessToken = generateAccessToken({user_name: creds.user_name, user_id: creds.user_id})
        console.log('inside login auth')
        // req.session.userName = req.body.userName
        res.json({accessToken, user_name: creds.user_name, user_id: creds.user_id} )
      }
    })
  }
  
})

module.exports = { loginRouter }
