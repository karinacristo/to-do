// controllers/authController.js
const User = require('../models/user'); // Modelo do usuário
const jwt = require('jsonwebtoken'); // Para gerar o token JWT
const dotenv = require('dotenv');
dotenv.config(); // Carregar variáveis de ambiente

// Função de login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gera o token JWT para o usuário
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Retorna o token
    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error); // Log do erro
    res.status(500).json({ message: 'Erro no login', error: error.message });
  }
};

// Função de cadastro (signup)
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria o novo usuário
    const newUser = new User({
      email,
      password,
    });

    // Salva o novo usuário no banco de dados
    await newUser.save(); // A senha será criptografada no middleware "pre('save')"

    // Gera o token JWT para o novo usuário
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Retorna o token
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro ao criar o usuário:', error); // Log do erro
    res.status(500).json({ message: 'Erro ao criar o usuário', error: error.message });
  }
};

module.exports = { login, signup };
