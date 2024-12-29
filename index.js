const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// ROUTES
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const testPlanRoutes = require('./routes/testPlans');
const roleRoutes = require('./routes/roles');
const permissionRoutes = require('./routes/permissions');
const testStepRoutes = require('./routes/testSteps');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Using Routes
app.use('/api/users', userRoutes);
app.use('/api/test-plans', testPlanRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/test-steps', testStepRoutes);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QA Testing API',
      version: '1.0.0',
      description: 'API for managing QA projects, test plans, and steps',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local server' },
    ]
  },
  apis: ['./routes/*.js'], // Point to your route files
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
