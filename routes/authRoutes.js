const express = require('express');
const { login, signup, refreshAccessToken } = require('../controllers/authController');
const router = express.Router();

// Rota de login
router.post('/login', login);

// Rota de cadastro
router.post('/signup', signup);

// Rota para gerar um novo access token com o refresh token
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
