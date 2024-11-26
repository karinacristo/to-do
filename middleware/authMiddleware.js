const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;

  // Verifica se o token está presente no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do header
      token = req.headers.authorization.split(' ')[1];

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adiciona os dados do usuário na requisição
      req.user = await User.findById(decoded.id).select('-password');
      
      // Chama o próximo middleware ou controller
      next();
    } catch (error) {
      // Em caso de erro, como token inválido ou expirado
      res.status(401).json({ message: "Não autorizado, token inválido!" });
    }
  } else {
    // Caso o token não tenha sido fornecido
    res.status(401).json({ message: "Não autorizado, token não fornecido!" });
  }
};
