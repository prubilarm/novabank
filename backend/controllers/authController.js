const User = require('../models/User');
const Account = require('../models/Account');
const supabase = require('../services/supabaseClient');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'novabank_secret';

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // 1. Registro en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // 2. Crear registro en tabla users usando el Modelo
    const userData = await User.create({
      id: authData.user.id,
      full_name: fullName,
      email: email,
    });

    // 3. Crear cuenta bancaria inicial
    await Account.create({
      user_id: userData.id,
      balance: 100.00
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ message: 'Credenciales inválidas' });

    const userProfile = await User.findById(data.user.id);
    const token = jwt.sign({ id: data.user.id, email: data.user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: userProfile.id,
        fullName: userProfile.full_name,
        email: userProfile.email,
        accountId: userProfile.accounts[0]?.id,
        balance: userProfile.accounts[0]?.balance
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
