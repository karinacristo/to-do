const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;

  // Verifica se o token está presente no header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: "Token não encontrado" });
      }

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Alterar de `decoded.id` para `decoded.userId`
req.user = await User.findById(decoded.userId).select('-password');


      // Adicionando um log para verificar se o usuário foi encontrado
      console.log("Usuário encontrado:", req.user);

      // Chama o próximo middleware ou controller
      next();
    } catch (error) {
      console.error("Erro ao verificar o token:", error); // Log detalhado do erro
      res.status(401).json({ message: "Não autorizado, token inválido ou expirado!" });
    }
  } else {
    // Caso o token não tenha sido fornecido
    res.status(401).json({ message: "Não autorizado, token não fornecido!" });
  }
};
