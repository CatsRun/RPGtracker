// const swaggerAutogen = require('swagger-autogen')();

// const doc = {
//   info: {
//     title: 'RPG Tracker API',
//     description: 'API documentation for the RPG Tracker project'
//   },
//       servers: [
//       {
//         url: "http://localhost:3000"
//       },
//       {
//         url: 'https://rpgtracker.onrender.com/',
//       }
//     ],
// schemes: ['http', 'https'],
// };

// const outputFile = './swagger-output.json';
// // const routes = ['./routes/characters.js', './routes/items.js', './routes/tasks.js', './routes/locations.js'];
// const routes = ['./routes/index.js'];

// swaggerAutogen(outputFile, routes, doc);

// "npm run swagger" will rebuild the swagger-output file.



const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RPG Tracker API",
      version: "1.0.0",
      description: "API documentation for the RPG Tracker project"
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: 'https://rpgtracker.onrender.com/',
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("RPG Tracker API is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
