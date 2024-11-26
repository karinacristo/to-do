const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet'); // Importa o helmet
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
const app = express();

// Configurações do Helmet para permitir fontes e estilos externos
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  })
);

// Middleware
app.use(express.json());

// Conexão com o banco de dados
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro na conexão com o MongoDB", error));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
