// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Para analisar requisições com JSON

// Conexão com o banco de dados
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro na conexão com o MongoDB", error));

// Rotas
app.use('/api/auth', authRoutes); // Inclui a rota de login
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
