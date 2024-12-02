const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

// Rota para criar uma tarefa (POST)
router.post('/', createTask);

// Rota para listar tarefas (GET)
router.get('/', getTasks);

// Rota para editar tarefa (PATCH) - Atualiza o título e/ou descrição
router.patch('/:id', updateTask);

// Rota para excluir tarefa (DELETE)
router.delete('/:id', deleteTask);

module.exports = router;
