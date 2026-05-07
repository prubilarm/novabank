// Punto de entrada principal del servidor NovaBank
// Aquí es donde nace toda la magia de nuestro banco digital
require('dotenv').config(); // Cargamos nuestras llaves secretas desde el archivo .env
const express = require('express'); // El motor que maneja nuestras rutas
const cors = require('cors'); // Permite que nuestra web se hable con nuestro servidor
const swaggerUi = require('swagger-ui-express'); // Para ver nuestra documentación interactiva
const specs = require('./config/swagger'); // La configuración de nuestra documentación
const authRoutes = require('./routes/authRoutes'); // Rutas para entrar y registrarse
const apiRoutes = require('./routes/apiRoutes'); // Rutas para dinero y perfil
const adminRoutes = require('./routes/adminRoutes'); // Rutas solo para el jefe (admin)
const errorHandler = require('./middlewares/errorHandler'); // El que atrapa errores si algo falla

const app = express();

// --- Configuraciones de Seguridad ---
// Permitimos que nuestra web y app móvil se comuniquen con el servidor
app.use(cors()); 
app.use(express.json()); // Permite que el servidor entienda datos en formato JSON
app.use(express.urlencoded({ extended: true }));

// --- Documentación Interactiva ---
// Puedes verla entrando a: http://localhost:3001/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// --- Ruta de Salud ---
// Solo para saber si el corazón del banco sigue latiendo
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Conexión de Rutas ---
app.use('/auth', authRoutes); // Todo lo relacionado con usuarios
app.use('/api', apiRoutes); // Todo lo relacionado con dinero y transacciones
app.use('/admin', adminRoutes); // Todo lo relacionado con el control administrativo

// --- Manejo de Errores ---
// Si hay un error, este código se encarga de que la app no se rompa y avise al usuario
app.use(errorHandler);

// --- Encendido del Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Banco NovaBank encendido en el puerto ${PORT}`);
  console.log(`📚 Documentación lista en http://localhost:${PORT}/api-docs`);
});
