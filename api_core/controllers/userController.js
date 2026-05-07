const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Perfil no encontrado' });

    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      accountId: user.accounts[0]?.id,
      balance: user.accounts[0]?.balance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  // Lógica para actualizar nombre, avatar, etc.
  res.json({ message: 'Perfil actualizado (simulado)' });
};
