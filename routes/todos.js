// MODULE
const express = require('express')
const router = express.Router()
// DATABASE
const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  try {
    return Todo.findAll({
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todos) => res.render('todos', { todos, error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => {
  const name = req.body.name

  return Todo.create({ name })
    .then(() => {
      req.flash('success', '新增成功!')
      return res.redirect('/todos')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

router.get('/:id', (req, res) => {
  // try {
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('todo', { todo }))
      // .catch((error) => {
      //   console.error(error)
      //   req.flash('error', '資料取得失敗:(')
      //   return res.redirect('back')
      // })
  // } 
  // catch (error) {
  //   console.error(error)
  //   req.flash('error', '伺服器錯誤')
  //   return res.redirect('back')
  // }
})

router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id

    return Todo.findByPk(id, {
      attributes: ['id', 'name', 'isComplete'],
      raw: true
    })
      .then((todo) => res.render('edit', { todo, error: req.flash('error') }))
      .catch((error) => {
        console.error(error)
        req.flash('error', '資料取得失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
})

router.put('/:id', (req, res, next) => {
    const { name, isComplete } = req.body
    const id = req.params.id

    return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
      .then(() => {
        req.flash('success', '更新成功!')
        return res.redirect(`/todos/${id}`)
      })
      .catch((error) => {
        error.errorMessage = '更新失敗:('
        next(error)
      })
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id

    return Todo.destroy({ where: { id } })
      .then(() => {
        req.flash('success', '刪除成功!')
        return res.redirect('/todos')
      })
      .catch((error) => {
        console.error(error)
        req.flash('error', '刪除失敗:(')
        return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
    req.flash('error', '刪除失敗:(')
    return res.redirect('back')
  }
})

module.exports = router
