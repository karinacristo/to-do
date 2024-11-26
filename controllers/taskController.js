const { body, validationResult } = require('express-validator');
const Task = require('../models/task');

// Validações para criar uma tarefa
const validateTask = [
  body('title').notEmpty().withMessage('O título é obrigatório').isLength({ min: 3 }).withMessage('O título deve ter no mínimo 3 caracteres'),
  body('description').optional().isLength({ max: 500 }).withMessage('A descrição deve ter no máximo 500 caracteres'),
];

// Criar uma nova tarefa
exports.createTask = [
  validateTask,
  async (req, res) => {
    // Validação dos dados recebidos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    try {
      // Cria uma nova tarefa associando ao ID do usuário
      const task = new Task({
        title,
        description,
        user: req.user.id, // Certifique-se que req.user.id vem do JWT e está correto
      });
      
      // Salva a tarefa no banco de dados
      await task.save();
      
      // Retorna a tarefa criada com status 201
      res.status(201).json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ message: "Erro ao criar tarefa", error });
    }
  }
];

// Obter todas as tarefas de um usuário
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter tarefas", error });
  }
};

// Atualizar uma tarefa
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, completed } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id }, // Garantir que o usuário seja o proprietário da tarefa
      { title, description, completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar tarefa", error });
  }
};

// Deletar uma tarefa
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar tarefa", error });
  }
};
