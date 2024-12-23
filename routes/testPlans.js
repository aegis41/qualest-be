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
 * /api/test-plans:
 *   post:
 *     summary: Create a new test plan
 *     tags: [Test Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               project_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Test plan created successfully
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, project_id } = req.body;

    // Validate project existence
    const project = await Project.findById(project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const testPlan = new TestPlan({ name, description, project_id });
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
 *     tags: [Test Plans]
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
