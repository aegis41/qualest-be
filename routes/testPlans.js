const express = require('express');
const TestPlan = require('../models/TestPlan');
const Project = require('../models/Project');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Test Plans
 *   description: API for managing test plans
 */

/**
 * @swagger
 * /api/testplans:
 *   post:
 *     summary: Create a new test plan
 *     tags:
 *       - TestPlans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the test plan
 *                 example: "User Registration Plan"
 *               description:
 *                 type: string
 *                 description: Description of the test plan
 *                 example: "This plan tests user registration workflows."
 *               project_id:
 *                 type: string
 *                 description: ID of the associated project
 *                 example: "60e8f8e5b9c3b3f51f16e13a"
 *               created_by:
 *                 type: string
 *                 description: ID of the user creating the test plan
 *                 example: "60e8f8e5b9c3b3f51f16e13b"
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of test steps (raw strings for now)
 *                 example: ["Step 1: Navigate to the homepage", "Step 2: Register a new user"]
 *     responses:
 *       201:
 *         description: Test plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the test plan
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Name of the test plan
 *                   example: "User Registration Plan"
 *                 description:
 *                   type: string
 *                   description: Description of the test plan
 *                   example: "This plan tests user registration workflows."
 *                 project_id:
 *                   type: string
 *                   description: ID of the associated project
 *                   example: "60e8f8e5b9c3b3f51f16e13a"
 *                 created_by:
 *                   type: string
 *                   description: ID of the user creating the test plan
 *                   example: "60e8f8e5b9c3b3f51f16e13b"
 *                 steps:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of test steps
 *                   example: ["Step 1: Navigate to the homepage", "Step 2: Register a new user"]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test plan was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test plan was last updated
 *                   example: "2024-12-23T16:21:52.933Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name and project ID are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post('/', async (req, res) => {
  try {
    const { name, description, project_id, created_by, steps } = req.body;

    // Validate required fields
    if (!name || !project_id) {
      return res.status(400).json({ error: 'Name and project ID are required' });
    }

    // Validate project ID
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Validate created_by if provided
    if (created_by) {
      const user = await User.findById(created_by);
      if (!user) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
    }

    // Create the test plan
    const testPlan = new TestPlan({
      name,
      description,
      project_id,
      created_by,
      steps: steps || [], // Allow empty or raw values for steps
    });

    await testPlan.save();

    res.status(201).json(testPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/test-plans/{id}:
 *   get:
 *     summary: Get a test plan by ID
 *     tags: 
 *       - Test Plans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test plan details
 */
router.get('/:id', async (req, res) => {
  try {
    const testPlan = await TestPlan.findById(req.params.id).populate('project_id').populate('steps');
    if (!testPlan) return res.status(404).json({ error: 'Test Plan not found' });

    res.json(testPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/test-plans:
 *   get:
 *     summary: Get all test plans
 *     tags: [Test Plans]
 *     responses:
 *       200:
 *         description: List of test plans
 */
router.get('/', async (req, res) => {
  try {
    const testPlans = await TestPlan.find().populate('project_id');
    res.json(testPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
