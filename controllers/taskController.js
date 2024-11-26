const Task = require('../models/task');

// Criar uma nova tarefa
exports.createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tarefa", error });
  }
};

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
      { _id: taskId, user: req.user.id },
      { title, description, completed },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar tarefa", error });
  }
};

// Deletar uma tarefa
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.findOneAndDelete({ _id: taskId, user: req.user.id });
    res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar tarefa", error });
  }
};
