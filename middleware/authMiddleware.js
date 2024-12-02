// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Certifique-se de que este caminho esteja correto

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrai o token
      token = req.headers.authorization.split(' ')[1];

      // Decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário pelo ID do token
      req.user = await User.findById(decoded.userId).select('-password');

      next(); // Continua para a próxima função
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token inválido ou não autorizado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Nenhum token fornecido, autorização negada' });
  }
};

module.exports = protect;
