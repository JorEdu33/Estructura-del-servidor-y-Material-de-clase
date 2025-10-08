// swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs');

function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger disponible en http://localhost:3000/api-docs');
}

module.exports = swaggerDocs;
