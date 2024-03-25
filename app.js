// MODULE
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
// ROUTES
const router = require('./routes') // 引用路由器
// EXPRESS
const app = express()
// SERVER
const port = 3000
// DATABASE
const db = require('./models')
const Todo = db.Todo
// TEMPLATE-ENGINE
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
// MIDDLEWARE
app.use(express.urlencoded({ extended: true })) // post data
app.use(methodOverride('_method')) // put patch delete
app.use(session({
	secret: 'ThisIsSecret',
	resave: false,
	saveUninitialized: false
}))
app.use(flash())
app.use(messageHandler)
app.use(router) // 將 request 導入路由器
app.use(errorHandler)

app.listen(port, () => {
  console.log(`http://localhost:${port}/todos`)
})
