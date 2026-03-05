const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:8080',
schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];
/*change ['./path/userRoutes.js', './path/bookRoutes.js'] to the correct path*/
swaggerAutogen(outputFile, routes, doc);

// "npm run swagger" will rebuild the swagger-output file.