// models/task.js
const mongoose = require('mongoose');

// Estrutura do modelo de Task
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Relacionando com o usuário
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
