// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Importando as rotas de autenticação
const taskRoutes = require('./routes/taskRoutes');  // Importando as rotas de tarefas
const protect = require('./middleware/authMiddleware');  // Middleware para proteger as rotas

// Configuração do dotenv
dotenv.config();

// Criação do servidor Express
const app = express();

// Middleware para parsear o corpo da requisição
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro na conexão com o MongoDB', err));

// Rotas de autenticação
app.use('/auth', authRoutes);  // Rotas de autenticação

// Rotas de tarefas (protegidas)
app.use('/tasks', protect, taskRoutes);  // Usando as rotas de tarefas com middleware de proteção

// Rota para testar se a proteção está funcionando
app.get('/protected-route', protect, (req, res) => {
  res.json({ message: 'Você está acessando uma rota protegida!', user: req.user });
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
