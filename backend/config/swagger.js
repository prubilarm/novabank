const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NovaBank Enterprise API',
      version: '1.0.0',
      description: 'Documentación de la API de NovaBank con estructura profesional',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Documentación en las rutas
};

const specs = swaggerJsdoc(options);

module.exports = specs;
