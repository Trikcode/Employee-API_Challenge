const express = require('express')
const router = express.Router()

const {
  signUp,
  login,
  confirm,
  reset,
  set,
} = require('../controllers/authContro')
router.post('/register', signUp)
router.post('/login', login)
router.get('/confirm/:token', confirm)
router.post('/reset', reset)
router.patch('/set/:email', set)

module.exports = router
