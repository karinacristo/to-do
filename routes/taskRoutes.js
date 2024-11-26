const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getTasks)  // Rota para obter as tarefas
  .post(protect, createTask); // Rota para criar uma nova tarefa

router.route('/:taskId')
  .put(protect, updateTask) // Rota para atualizar tarefa
  .delete(protect, deleteTask); // Rota para deletar tarefa

module.exports = router;
