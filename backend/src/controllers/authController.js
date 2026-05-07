const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
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

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // 2. Crear perfil en tabla pública de perfiles (PostgreSQL)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: authData.user.id, 
          full_name: fullName, 
          email: email, 
          account_number: accountNumber,
          balance: 1000.0 
        }
      ]);

    if (profileError) return res.status(400).json({ message: profileError.message });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
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

    // Obtener perfil detallado
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const token = jwt.sign({ id: data.user.id, email: data.user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: profile });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
