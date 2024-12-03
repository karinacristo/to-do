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

    // Gera o token JWT para o usuário (access token) com expiração de 1 hora
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Gera o refresh token com expiração de 30 dias
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Retorna o access token e o refresh token
    res.json({ token, refreshToken });
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

    // Gera o token JWT para o novo usuário (access token) com expiração de 1 hora
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Gera o refresh token com expiração de 30 dias
    const refreshToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Retorna o access token e o refresh token
    res.status(201).json({ token, refreshToken });
  } catch (error) {
    console.error('Erro ao criar o usuário:', error); // Log do erro
    res.status(500).json({ message: 'Erro ao criar o usuário', error: error.message });
  }
};

// Função para gerar um novo access token usando o refresh token
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token necessário' });
  }

  // Verifica se o refresh token é válido
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token inválido' });
    }

    // Gera um novo access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Retorna o novo access token
    res.json({ newAccessToken });
  });
};

module.exports = { login, signup, refreshAccessToken };
