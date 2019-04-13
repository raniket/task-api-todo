const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const checkAuth = require('../middleware/check-auth');
const TodoControler = require('../controlers/todos');

router.get('/', checkAuth, TodoControler.getAllTodos);

router.post('/', checkAuth, TodoControler.createTodo);

router.get('/:todoId', checkAuth, TodoControler.getTodo);

router.put('/:todoId', checkAuth, TodoControler.updateTodo);

router.delete('/:todoId', checkAuth, TodoControler.deleteTodo);

module.exports = router;
