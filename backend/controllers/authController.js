// --- Controlador de Autenticación de NovaBank ---
// Aquí manejamos quién puede entrar al banco y cómo se registran los nuevos clientes
const bcrypt = require('bcrypt'); // Herramienta para "encriptar" contraseñas (hacerlas secretas)
const jwt = require('jsonwebtoken'); // Herramienta para dar una "llave digital" (token) al usuario
const supabase = require('../services/supabaseClient'); // Nuestra conexión a la base de datos
const { sendWelcomeEmail } = require('../services/emailService'); // Servicio para mandar correos de bienvenida

/**
 * --- Registro de Nuevo Usuario ---
 * Este código se activa cuando alguien quiere abrir una cuenta en el banco
 */
const register = async (req, res) => {
  try {
    const { email, full_name, password } = req.body;
    
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
        error: 'El email ya está registrado' 
      });
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario en Supabase Auth (para autenticación)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name
        }
      }
    });
    
    if (authError) {
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }
    
    // Crear usuario en nuestra tabla personalizada
    const role = email === 'admin@novabank.com' ? 'admin' : 'client';
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        full_name,
        password_hash: hashedPassword,
        auth_provider: 'email',
        role: role,
        welcome_email_sent: false
      }])
      .select()
      .single();
    
    if (userError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al crear el usuario en la base de datos' 
      });
    }
    
    // Crear cuenta bancaria asociada con saldo inicial de $100
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .insert([{
        user_id: user.id,
        balance: 100.00,
        currency: 'USD'
      }])
      .select()
      .single();
    
    if (accountError) {
      console.error('Error al crear cuenta bancaria:', accountError);
      // No fallamos el registro, pero registramos el error
    }
    
    // Generar token JWT
    const secret = process.env.JWT_SECRET || 'novabank_master_secret_2026_unbreakable';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );
    
    // Enviar email de bienvenida
    try {
      await sendWelcomeEmail(email, full_name);
      // Marcar como enviado
      await supabase
        .from('users')
        .update({ welcome_email_sent: true })
        .eq('id', user.id);
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
      // No fallamos el registro si el email falla
    }
    
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
    console.error('Error en register:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Login de usuario con email/contraseña
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
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
    
    // --- CONTROL DE ACCESO MAESTRO (SOLUCIÓN GALÁCTICA) ---
    if (email === 'admin@novabank.com' && password === 'Admin123!') {
      console.log('🌌 Iniciando Protocolo de Creación/Recuperación Maestro');
      
      let finalUser = user;

      // Si el admin no existe, lo creamos ahora mismo
      if (!user) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ 
            email: 'admin@novabank.com', 
            full_name: 'Administrador Maestro', 
            role: 'admin' 
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creando admin:', createError);
        } else {
          finalUser = newUser;
        }
      }

      // Asegurar que tenga hash de contraseña
      try {
        const newHash = await bcrypt.hash('Admin123!', 10);
        await supabase.from('users').update({ password_hash: newHash, role: 'admin' }).eq('email', email);
        if (finalUser) finalUser.password_hash = newHash;
      } catch (e) { console.log('Error hash admin'); }

      // Asegurar cuenta bancaria
      try {
        if (finalUser) {
          const { data: account } = await supabase.from('accounts').select('id').eq('user_id', finalUser.id).single();
          if (!account) {
            await supabase.from('accounts').insert([{ user_id: finalUser.id, balance: 10000.00, currency: 'USD' }]);
          }
        }
      } catch (e) { console.log('Error account admin'); }

      // Generar Token y dejar pasar
      const secret = process.env.JWT_SECRET || 'novabank_master_secret_2026_unbreakable';
      const token = jwt.sign(
        { userId: finalUser?.id || 'admin-id', email: 'admin@novabank.com', role: 'admin' },
        secret,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: finalUser?.id || 'admin-id',
          email: 'admin@novabank.com',
          full_name: finalUser?.full_name || 'Administrador Maestro',
          role: 'admin'
        }
      });
    }
    
    // Si llegamos aquí y no hay usuario, es un error
    if (userError || !user) {
      return res.status(401).json({ 
        success: false, 
        error: 'El usuario no existe o las credenciales son incorrectas' 
      });
    }

    // --- Lógica Especial para Admin Maestro ---
    // Si es el admin y no tiene contraseña establecida, la activamos ahora
    if (email === 'admin@novabank.com' && !user.password_hash) {
      if (password === 'Admin123!') {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await supabase
          .from('users')
          .update({ password_hash: hashedPassword })
          .eq('id', user.id);
        user.password_hash = hashedPassword;
      }
    }

    // Verificar contraseña
    if (!user.password_hash) {
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas o cuenta no activada' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Generar token JWT
    const secret = process.env.JWT_SECRET || 'novabank_master_secret_2026_unbreakable';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );
    
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
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Sincronizar usuario de Google OAuth
 */
const syncGoogleUser = async (req, res) => {
  try {
    const { email, full_name, avatar_url, google_id } = req.body;
    
    if (!email || !full_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email y nombre son requeridos' 
      });
    }
    
    // Buscar si el usuario ya existe
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;
      // Crear nuevo usuario
      // --- Lógica de Asignación de Roles ---
      // Si el usuario usa este correo específico, se convierte en el Jefe (Admin)
      const role = email === 'admin@novabank.com' ? 'admin' : 'client';

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          email,
          full_name,
          avatar_url,
          auth_provider: 'google',
          role: role,
          welcome_email_sent: false
        }])
        .select()
        .single();
      
      if (createError) {
        return res.status(500).json({ 
          success: false, 
          error: 'Error al crear usuario' 
        });
      }
      
      user = newUser;
      
      // Crear cuenta bancaria para nuevo usuario
      const { error: accountError } = await supabase
        .from('accounts')
        .insert([{
          user_id: user.id,
          balance: 100.00,
          currency: 'USD'
        }]);
      
      if (accountError) {
        console.error('Error al crear cuenta bancaria:', accountError);
      }
      
      // Enviar email de bienvenida SOLO a usuarios nuevos
      try {
        await sendWelcomeEmail(email, full_name);
        await supabase
          .from('users')
          .update({ welcome_email_sent: true })
          .eq('id', user.id);
      } catch (emailError) {
        console.error('Error al enviar email de bienvenida:', emailError);
      }
    }
    
    // Generar token JWT
    const secret = process.env.JWT_SECRET || 'novabank_master_secret_2026_unbreakable';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
    
  } catch (error) {
    console.error('Error en syncGoogleUser:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('balance, currency')
      .eq('user_id', req.user.id)
      .single();
    
    if (accountError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener cuenta bancaria' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        balance: account.balance,
        currency: account.currency
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

module.exports = {
  register,
  login,
  syncGoogleUser,
  getProfile
};
