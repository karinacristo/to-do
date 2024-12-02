const Task = require('../models/task');

// Criar nova tarefa
const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
  }

  try {
    const task = new Task({
      title,
      description,
      user: req.user._id, // O id do usuário autenticado
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error: error.message });
  }
};

// Listar tarefas do usuário autenticado
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error: error.message });
  }
};

// Editar tarefa (atualizar título e/ou descrição)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    return res.status(400).json({ message: 'Título ou descrição devem ser fornecidos.' });
  }

  try {
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    if (title) task.title = title;
    if (description) task.description = description;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

// Excluir tarefa
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir tarefa', error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
