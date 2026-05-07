/**
 * Manejador global de errores
 * Captura cualquier error no manejado en la aplicación
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  // Determinar código de estado
  const statusCode = err.statusCode || 500;
  
  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
