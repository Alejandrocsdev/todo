// MODULE
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
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

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/todos', (req, res) => {
	return Todo.findAll({
		attributes: ['id', 'name', 'isComplete'],
		raw: true
	})
		.then((todos) => res.render('todos', { todos, message: req.flash('success') }))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
	const name = req.body.name

	return Todo.create({ name })
		.then(() => {
			req.flash('success', '新增成功!')
			return res.redirect('/todos')
		})
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((err) => console.log(err))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  }).then((todo) => res.render('edit', { todo }))
})

app.put('/todos/:id', (req, res) => {
  const { name, isComplete } = req.body
  const id = req.params.id

  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } }).then(() =>
    res.redirect(`/todos/${id}`)
  )
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.destroy({ where: { id } }).then(() => res.redirect('/todos'))
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/todos`)
})
