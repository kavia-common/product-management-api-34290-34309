const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description: 'An Express API providing CRUD operations for products',
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Sample Product' },
            price: { type: 'number', example: 19.99, minimum: 0 },
            quantity: { type: 'integer', example: 5, minimum: 0 },
          },
          required: ['id', 'name', 'price', 'quantity'],
        },
        ProductCreate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'New Product' },
            price: { type: 'number', example: 9.99, minimum: 0 },
            quantity: { type: 'integer', example: 10, minimum: 0 },
          },
          required: ['name', 'price', 'quantity'],
        },
      },
    },
  },
  // Ensure both index and products routes are scanned
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
