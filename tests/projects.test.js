const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../index'); // Import your Express app
const Project = require('../models/Project'); // Import the Project model
const { expect } = chai;

// Middleware
chai.use(chaiHttp);

// Projects API Unit Tests
describe('Projects API', () => {
  before(async () => {
    // Connect to the database before running tests
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to test database');
  });

  after(async () => {
    // Disconnect from the database after all tests
    await mongoose.connection.close();
    console.log('Disconnected from test database');
  });

  beforeEach(async () => {
    // Clear the projects collection before each test
    await Project.deleteMany({});
    console.log('Cleared projects collection');
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'This is a test project.',
      };

      const res = await chai.request(app).post('/api/projects').send(projectData);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal(projectData.name);
      expect(res.body.description).to.equal(projectData.description);
    });
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const sampleProject = new Project({ name: 'Sample Project', description: 'Sample description' });
      await sampleProject.save();

      const res = await chai.request(app).get('/api/projects');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
      expect(res.body[0].name).to.equal(sampleProject.name);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a single project by ID', async () => {
      const sampleProject = new Project({ name: 'Sample Project', description: 'Sample description' });
      await sampleProject.save();

      const res = await chai.request(app).get(`/api/projects/${sampleProject._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id').that.equals(sampleProject._id.toString());
      expect(res.body.name).to.equal(sampleProject.name);
    });

    it('should return 404 if the project does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await chai.request(app).get(`/api/projects/${nonExistentId}`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'Project not found');
    });
  });
});
