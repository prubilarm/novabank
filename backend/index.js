const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIG ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NovaBank API MVC',
      version: '1.0.0',
      description: 'API Bancaria con Arquitectura MVC y Supabase',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Inicio
app.listen(PORT, () => {
  console.log(`🚀 NovaBank MVC API activa en http://localhost:${PORT}`);
  console.log(`📄 Documentación: http://localhost:${PORT}/api-docs`);
});
