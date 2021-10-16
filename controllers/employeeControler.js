const Employee = require('../model/Employee')
const Manager = require('../model/manager')

const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const sendMsg = require('@sendgrid/mail')
//createEmployee
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      nationalID,
      phoneNumber,
      email,
      dateOfBirth,
      status,
      position,
    } = req.body
    await Employee.create({
      name: name,
      nationalID: nationalID,
      phoneNumber: phoneNumber,
      email: email,
      dateOfBirth: dateOfBirth,
      status: status,
      position: position,
    })
    sendMsg.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'ayesiganobert@gmail.com',
      subject: 'Thanks always',
      text: 'Thanks always!!! ',
      html: `<p>Hey hello ${name} <br> Thanks for joining us. Here at Wise Acts Technologies our aim is to serve you</p>`,
    }
    sendMsg
      .send(msg)
      .then(console.log('Email sent'))
      .catch((error) => console.log(error))
    res.status(StatusCodes.CREATED).send('Employe created')
  } catch (error) {
    console.log(error)
  }
}
//searchEmployee
const SearchEmployee = async (req, res) => {
  let num = Math.floor(1000 + Math.random() * 9000)
  const code = 'EMP' + num

  const findEmployee = await Employee.findOne({
    position,
    name,
    email,
    phoneNumber,
    code,
  })
  res.status(StatusCodes.OK).json({ findEmployee })
}
//editEmployee
const updateEmployee = async (req, res) => {
  const {
    params: { id: employeeId },
  } = req

  const employee = await Employee.findByIdAndUpdate(
    { _id: employeeId, createdBy: Manager.id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!employee) {
    throw new NotFoundError(`No Employee with id ${employeeId}`)
  }
  res.status(StatusCodes.OK).json({ employee })
}

//deleteEmployee
const deleteEmployee = async (req, res) => {
  const {
    params: { id: employeeId },
  } = req

  const employee = await Employee.findByIdAndRemove({
    _id: employeeId,
    createdBy: Manager.id,
  })
  if (!employee) {
    throw new NotFoundError(`No Employee with id ${employeeId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createEmployee,
  deleteEmployee,
  updateEmployee,
  SearchEmployee,
}
