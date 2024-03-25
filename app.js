// MODULE
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
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

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name

  return Todo.create({ name })
    .then(() => res.redirect('/todos'))
    .catch((err) => console.log(err))
})

app.get('/todos/:id', (req, res) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name'],
		raw: true
	})
		.then((todo) => res.render('todo', { todo }))
		.catch((err) => console.log(err))
})

app.get('/todos/:id/edit', (req, res) => {
	const id = req.params.id

	return Todo.findByPk(id, {
		attributes: ['id', 'name'],
		raw: true
	})
		.then((todo) => res.render('edit', { todo }))
})

app.put('/todos/:id', (req, res) => {
	const body = req.body
	const id = req.params.id

	return Todo.update({ name: body.name }, { where: { id }})
		.then(() => res.redirect(`/todos/${id}`))
})

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id

	return Todo.destroy({ where: { id }})
		.then(() => res.redirect('/todos'))
})

app.listen(port, () => {
  console.log(`http://localhost:${port}/todos`)
})
