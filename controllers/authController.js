// controllers/authController.js
const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// Rota de login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica a senha (assumindo que você tenha uma função para comparar a senha)
    const isMatch = await user.matchPassword(password); // Essa função deve ser criada no model User

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Gerar o token
    const token = generateToken(user);

    // Enviar o token como resposta
    res.json({
      message: 'Login bem-sucedido',
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};
