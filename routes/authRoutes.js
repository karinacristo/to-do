// routes/authRoutes.js
const express = require('express');
const { login, signup } = require('../controllers/authController'); // Importando a função signup
const router = express.Router();

// Rota de login
router.post('/login', login);

// Rota de cadastro
router.post('/signup', signup); // Nova rota de cadastro

module.exports = router;
