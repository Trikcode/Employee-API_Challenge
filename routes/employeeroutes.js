const express = require('express')

const router = express.Router()
const {
  createEmployee,
  deleteEmployee,

  updateEmployee,
  SearchEmployee,
} = require('../controllers/employeeControler')

router.route('/').post(createEmployee)

router
  .route('/:id')
  .get(SearchEmployee)
  .delete(deleteEmployee)
  .patch(updateEmployee)

module.exports = router
