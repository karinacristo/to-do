// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, // Aqui você inclui o ID do usuário no payload
    process.env.JWT_SECRET, // Use sua chave secreta definida no .env
    { expiresIn: '30d' } // Tempo de expiração do token
  );
};

module.exports = generateToken;
