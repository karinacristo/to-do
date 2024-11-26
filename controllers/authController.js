const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Registro de novo usuário
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário", error });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error });
  }
};
