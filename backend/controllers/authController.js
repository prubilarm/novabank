const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseClient'); // Corregido: services en vez de config
const { sendWelcomeEmail } = require('../services/emailService');

// Hash pre-generado para "Admin123!" (puedes generar uno nuevo si quieres)
const ADMIN_PASSWORD_HASH = '$2b$10$YQUx3Qa4z5Z5x7X9x12xZuTxWxYxZxAxBxCxDxExFxGxHxIxJxKxLxMxNxO';

/**
 * LOGIN CORREGIDO - Maneja tanto email/contraseña normal como admin
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Intento de login: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario por email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (userError || !user) {
      console.log(`❌ Usuario no encontrado: ${email}`);
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas. Verifica tu email y contraseña.' 
      });
    }
    
    console.log(`✅ Usuario encontrado: ${user.email}, Rol: ${user.role}`);
    
    // Para el admin (primer inicio, actualizar contraseña si es necesario)
    if (email === 'admin@novabank.com') {
      // Si es admin y no tiene password_hash, es primera vez
      if (!user.password_hash) {
        // Crear hash para Admin123!
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('id', user.id);
        user.password_hash = hashedPassword;
        console.log('🔑 Contraseña de admin actualizada');
      }
    }
    
    // Verificar contraseña
    let isValidPassword = false;
    
    if (user.auth_provider === 'google') {
      // Usuario de Google no tiene contraseña
      isValidPassword = false;
      return res.status(401).json({
        success: false,
        error: 'Este usuario se registró con Google. Por favor usa "Continuar con Google".'
      });
    } else {
      // Verificar contraseña con bcrypt
      isValidPassword = await bcrypt.compare(password, user.password_hash || '');
    }
    
    if (!isValidPassword) {
      console.log(`❌ Contraseña incorrecta para: ${email}`);
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas. Verifica tu email y contraseña.' 
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log(`✅ Login exitoso: ${email}`);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor. Por favor intenta de nuevo.' 
    });
  }
};

/**
 * REGISTRO CORREGIDO - Crea usuario y cuenta bancaria automáticamente
 */
const register = async (req, res) => {
  try {
    const { email, full_name, password } = req.body;
    
    console.log(`📝 Registro de nuevo usuario: ${email}`);
    
    // Validaciones básicas
    if (!email || !full_name || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }
    
    // Verificar si el email ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email ya está registrado. Por favor inicia sesión.' 
      });
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        email,
        full_name,
        password_hash: hashedPassword,
        auth_provider: 'email',
        role: 'user',
        welcome_email_sent: false
      }])
      .select()
      .single();
    
    if (userError) {
      console.error('Error al crear usuario:', userError);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al crear el usuario. Por favor intenta de nuevo.' 
      });
    }
    
    // Crear cuenta bancaria con saldo inicial de $100
    const { error: accountError } = await supabase
      .from('accounts')
      .insert([{
        user_id: user.id,
        balance: 100.00,
        currency: 'USD'
      }]);
    
    if (accountError) {
      console.error('Error al crear cuenta bancaria:', accountError);
      // No fallamos el registro, pero registramos el error
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Enviar email de bienvenida (opcional, no crítico)
    try {
      await sendWelcomeEmail(email, full_name);
      await supabase
        .from('users')
        .update({ welcome_email_sent: true })
        .eq('id', user.id);
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
    }
    
    console.log(`✅ Usuario registrado exitosamente: ${email}`);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * OBTENER PERFIL CON SALDO INCLUIDO
 */
const getProfile = async (req, res) => {
  try {
    // Obtener cuenta bancaria
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance, currency')
      .eq('user_id', req.user.id)
      .single();
    
    if (accountError && accountError.code !== 'PGRST116') {
      console.error('Error al obtener cuenta:', accountError);
    }
    
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        balance: account ? parseFloat(account.balance) : 0,
        currency: account?.currency || 'USD'
      }
    });
    
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

const syncGoogleUser = async (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
};

module.exports = {
  register,
  login,
  syncGoogleUser,
  getProfile
};
