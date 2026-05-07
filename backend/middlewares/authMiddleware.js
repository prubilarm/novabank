const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseClient');

/**
 * Middleware para verificar el token JWT
 * Se ejecuta antes de cualquier ruta protegida
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No se proporcionó token de autenticación' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const secret = process.env.JWT_SECRET || 'novabank_master_secret_2026_unbreakable';
    const decoded = jwt.verify(token, secret);
    
    // Buscar usuario en la base de datos
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Adjuntar usuario al request para uso posterior
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expirado' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno al verificar token' 
    });
  }
};

// Middleware para verificar que el usuario sea admin
const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
