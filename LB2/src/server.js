import express from 'express';
import cors from 'cors';
import session from 'express-session';
import swaggerAutogenImport from 'swagger-autogen';
import fs from 'fs';
import swaggerUiExpress from 'swagger-ui-express';
import tasksRouter from './tasksRouter.js';
import authRouter from './authRouter.js';

const swaggerAutogen = swaggerAutogenImport();

const doc = {
  info: {
    title: 'Meine Aufgaben',
    description: 'ÜK 295',
  },
  host: 'localhost:3000',
  definitions: {
    Task: {
      id: '',
      title: '',
      description: '',
      creator: '',
      doneAt: '',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./tasksRouter.js', './authRouter.js'];

swaggerAutogen(outputFile, routes, doc);
const app = express();
const port = 3000;

// Session-Konfiguration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Swagger endpoint
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(JSON.parse(fs.readFileSync('./swagger.json'))));

// Use routers
app.use('/tasks', tasksRouter);
app.use('/', authRouter);

// Error-Handling-Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
