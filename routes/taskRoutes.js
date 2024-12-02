// routes/taskRoutes.js
const express = require('express');
const { createTask, getTasks } = require('../controllers/taskController');  // Importando o controller de tarefas
const router = express.Router();

// Rota para criar uma tarefa (POST)
router.post('/', createTask);

// Rota para listar as tarefas do usuário (GET)
router.get('/', getTasks);

module.exports = router;
