const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Uso de Rutas
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Manejo de errores global (Debe ir después de las rutas)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 NovaBank Enterprise Server corriendo en http://localhost:${PORT}`);
  console.log(`📄 API Docs: http://localhost:${PORT}/api-docs`);
});
