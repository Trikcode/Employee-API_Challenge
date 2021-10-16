require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connectDB = require('./database/connect')
// routes
const authRouter = require('./routes/auth')
const EmployeeRouter = require('./routes/employeeroutes')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const notFoundMiddleware = require('./middleware/notFoundMiddleware')
const errorHandlerMiddleware = require('./middleware/handleErrors')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const SwaggerDoc = YAML.load('./swagger.yaml')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)
//allow me pass json
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use('/api-documents', swaggerUI.serve, swaggerUI.setup(SwaggerDoc))

app.get('/', (req, res) => {
  res.send('<h1>Employee API</h1><a href="/api-documents">Documentation</a>')
})
//static routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/employee', EmployeeRouter)

// error handler Middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
//start conncetion
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
