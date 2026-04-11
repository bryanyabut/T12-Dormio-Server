const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dormio API',
      version: '1.0.0',
      description: 'API documentation for Dormio Room Management',
    },
    servers: [{ url: 'http://localhost:3000' }], 
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);