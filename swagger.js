const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000',
schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/characters.js', './routes/items.js', './routes/tasks.js', './routes/locations.js'];
/*change ['./path/userRoutes.js', './path/bookRoutes.js'] to the correct path*/
swaggerAutogen(outputFile, routes, doc);

// "npm run swagger" will rebuild the swagger-output file.