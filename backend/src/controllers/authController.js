const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'novabank_secret';

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // 2. Crear perfil en tabla 'users' (Esquema Obligatorio)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, 
          full_name: fullName, 
          email: email, 
          auth_provider: 'email'
        }
      ])
      .select()
      .single();

    if (userError) return res.status(400).json({ message: userError.message });

    // 3. Crear cuenta bancaria inicial en tabla 'accounts'
    const { error: accountError } = await supabase
      .from('accounts')
      .insert([
        { 
          user_id: userData.id, 
          balance: 100.00, // Saldo inicial por defecto según esquema
          currency: 'USD'
        }
      ]);

    if (accountError) return res.status(400).json({ message: accountError.message });

    res.status(201).json({ message: 'Usuario y cuenta creados correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Obtener perfil del usuario y su cuenta principal
    const { data: profile } = await supabase
      .from('users')
      .select('*, accounts(*)')
      .eq('id', data.user.id)
      .single();

    const token = jwt.sign({ id: data.user.id, email: data.user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        accountId: profile.accounts[0]?.id,
        balance: profile.accounts[0]?.balance
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('users')
      .select('*, accounts(*)')
      .eq('id', req.user.id)
      .single();

    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });

    res.json({
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      accountId: profile.accounts[0]?.id,
      balance: profile.accounts[0]?.balance
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};
