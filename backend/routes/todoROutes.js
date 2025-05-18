const express = require('express');
const auth = require('../middlewares/checkAuth');
const todoController = require('../controllers/todoController');
const router = express.Router();



router.post('/createtodo', auth.checkAuth, todoController.createTodo);
router.get('/alltodos', auth.checkAuth, todoController.getTodos);
router.get('/singletodo/:id', auth.checkAuth, todoController.getSingleTodo);
router.put('/updatetodo/:id', auth.checkAuth, todoController.updateTodo);
router.delete('/deletetodo/:id', auth.checkAuth, todoController.deleteTodo);

module.exports = router;