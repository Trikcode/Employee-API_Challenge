const Manager = require('../model/manager')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const sendMsg = require('@sendgrid/mail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//signUp
const signUp = async (req, res) => {
  try {
    const {
      name,
      nationalID,
      phoneNumber,
      email,
      dateOfBirth,
      status,
      position,
      password,
    } = req.body
    //hashing the password
    const hashed = await bcrypt.hash(password, 10)
    //create managerdetails in database
    const manager = await Manager.create({
      name,
      nationalID,
      phoneNumber,
      email,
      dateOfBirth,
      status,
      position,
      password: hashed,
    })

    //generate EmailToken for verification
    const emailToken = jwt.sign(
      { managerId: manager._id, email: manager.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )
    res.status(StatusCodes.CREATED).json({ manager, emailToken })
    //confirmation url
    const url = `http://localhost:5000/api/v1/auth/confirm/${emailToken}`
    //send Email
    sendMsg.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'ayesiganobert@gmail.com',
      subject: 'Thanks always',
      text: 'Thanks always!!! ',
      html: `Thanks for signing up with us follow this link <a href="${url}"> confirm </a> to confirm your email `,
    }
    sendMsg
      .send(msg)
      .then(console.log('Email sent'))
      .catch((error) => console.log(error))
  } catch (error) {
    console.log(error)
  }
}

//Verify Email
const confirm = async (req, res) => {
  try {
    const {
      manager: { id },
    } = jwt.verify(req.params.emailToken, JWT_SECRET)
    await Manager.findOneAndUpdate({ confirmed: true }, { where: { id } })
  } catch (error) {
    res.send('error')
  }
  return res.redirect('http://localhost:5000/api/v1/auth/login') //redirect to login
}

// login
const login = async (req, res) => {
  const { email, password } = req.body
  //validate Email and password
  if (!email || !password) {
    throw new BadRequestError('Invalid credentials')
  }

  //find password and compare
  const managerPassword = await Manager.findOne({ password })
  const check = await bcrypt.compare(password, managerPassword)
  if (!check) {
    throw new UnauthenticatedError('Invalid password')
  }
  const token = jwt.sign(
    { managerId: manager._id, email: manager.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )
  await Manager.findOneAndUpdate({ isloggedIn: true })
  res.status(StatusCodes.CREATED).json({ token })
}

//request for password reset
const reset = async (req, res) => {
  const { id, email } = req.body

  const url = `http://localhost:5000/api/v1/auth/set/${(email, id)}`
  sendMsg.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email,
    from: 'ayesiganobert@gmail.com',
    subject: 'Thanks always',
    text: 'Thanks always!!! ',
    html: `Thanks for signing up with us follow this link <a href="${url}"> confirm </a> to confirm your email `,
  }
  sendMsg
    .send(msg)
    .then(console.log('Email sent'))
    .catch((error) => console.log(error))

  res.status(StatusCodes.OK).json()
}

//set new Password
const set = async (req, res) => {
  const manager = await Manager.findByIdAndUpdate({ ManagerID: manager._id })
  if (req.params.id === managerID) {
    await bcrypt.hash(req.body.password, 10)
    res.redirect('http://localhost:5000/api/v1/auth/login')
  } else {
    throw new BadRequestError('Invalid credentials')
  }
}

module.exports = {
  signUp,
  login,
  confirm,
  set,
  reset,
}
