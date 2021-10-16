const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const ManagerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide a name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide an email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },

    position: {
      type: String,
      enum: ['MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'DEVOPS'],
      default: 'MANAGER',
    },
    password: {
      type: String,
      required: [true, 'provide password'],
      minlength: 6,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    isloggedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)
ManagerSchema.methods.comparePassword = async function (managerPassword) {
  const isMatch = await bcrypt.compare(managerPassword, this.password)
  return isMatch
}
module.exports = mongoose.model('Manager', ManagerSchema)
