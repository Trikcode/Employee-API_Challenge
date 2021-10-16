const mongoose = require('mongoose')
const validator = require('validator')

const EmployeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide a name'],
    },
    nationalID: {
      type: Number,
      minlength: 16,
      maxlength: 16,
      unique: true,
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
    dateOfBirth: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'INACTIVE',
    },
    position: {
      type: String,
      enum: ['MANAGER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'DEVOPS'],
    },
    code: {
      type: Number,
      unique: true,
      default: 'EMP' + Math.floor(1000 + Math.random() * 9000),
    },
    phoneNumber: {
      type: String,
      unique: true,
      default: '+255704353242',
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Manager',
      required: [true, 'Please provide user'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Employee', EmployeSchema)
