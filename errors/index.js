const CustomError = require('./CustomError')
const BadRequestError = require('./badRequest')
const NotFoundError = require('./notFound')
const UnauthenticatedError = require('./unauthorized')

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
}
