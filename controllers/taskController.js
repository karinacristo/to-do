// controllers/taskController.js
const Task = require('../models/task');  // Importando o modelo de tarefa

// Criar uma nova tarefa
const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
  }

  try {
    const task = new Task({
      title,
      description,
      user: req.user._id,  // O id do usuário autenticado
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
  }
};

// Listar todas as tarefas do usuário autenticado
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });  // Filtra as tarefas pelo id do usuário
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error: error.message });
  }
};

module.exports = { createTask, getTasks };
