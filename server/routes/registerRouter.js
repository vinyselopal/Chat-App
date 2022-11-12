const express = require('express')
const { pool } = require('../database/init')
const registerRouter = express.Router()
const { validatePassword, validateUserName } = require('../utils.js')
const bcrypt = require('bcrypt')
const { insertUser } = require('../database/queries')

const saltRounds = 10

registerRouter.post('/', async (req, res) => {

  const checkedUser = await validateUserName(req.body.userName)

  if (!checkedUser) {
    res.status(400).json('user already exists')
    res.end()
  }


  else {
    const validated = validatePassword(req.body.password)
    if (validated === 'valid') {
      const saltedPass = await bcrypt.genSalt(saltRounds)
      const hashedPass = await bcrypt.hash(req.body.password, saltedPass)
  
      pool.query(insertUser, [req.body.userName, hashedPass])
      res.status(200).json(validated)
    } else {
      res.status(400).json(validated)
      // send not validated response
    }
  }

  
})

module.exports = { registerRouter }
