const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NovaBank API',
      version: '1.0.0',
      description: 'API completa para el sistema bancario NovaBank',
      contact: {
        name: 'Soporte NovaBank',
        email: 'soporte@novabank.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://novabank-api.vercel.app',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            full_name: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            transaction_type: { type: 'string', enum: ['deposit', 'transfer', 'withdrawal'] },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Autenticación de usuarios' },
      { name: 'Transactions', description: 'Operaciones bancarias' },
      { name: 'Admin', description: 'Panel de administración' }
    ]
  },
  apis: ['./routes/*.js'] // Archivos que contienen anotaciones Swagger
};

module.exports = swaggerJsdoc(options);
