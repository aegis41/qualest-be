const express = require('express');
const router = express.Router();
const TestPlan = require('../models/TestPlan');

/**
 * @swagger
 * tags:
 *   name: TestPlans
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
 *                 description: Name of the test plan
 *                 example: "User Registration Plan"
 *               description:
 *                 type: string
 *                 description: Description of the test plan
 *                 example: "This plan tests user registration workflows."
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
 *     summary: Retrieve a single test plan by ID
 *     tags: [TestPlans]
 *     summary: Get a test plan by ID
 *     tags: 
 *       - Test Plans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test plan to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the test plan
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
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the associated project
 *                       example: "67695bb6cfced1e07d82b370"
 *                     name:
 *                       type: string
 *                       description: Project name
 *                       example: "Example Project One"
 *                     description:
 *                       type: string
 *                       description: Text description of the project
 *                       example: "This describes Example Project One"
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
 *       404:
 *         description: Test plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test plan not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the test plan by ID and populate project data
    const testPlan = await TestPlan.findOne({ _id: id, isDeleted: false}).populate('project_id', 'name description');

    // Handle test plan not found
    if (!testPlan) {
      return res.status(404).json({ error: 'Test plan not found' });
    }

    // Respond with the found test plan
    res.status(200).json(testPlan);
  } catch (err) {
    // Handle invalid ObjectId or other server errors
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/test-plans/{id}:
 *   put:
 *     summary: Update a test plan
 *     tags: [TestPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the test plan
 *                 example: "Updated Test Plan Name"
 *               description:
 *                 type: string
 *                 description: Updated description of the test plan
 *                 example: "Updated description for the test plan."
 *               project_id:
 *                 type: string
 *                 description: Updated ID of the associated project
 *                 example: "60e8f8e5b9c3b3f51f16e13a"
 *     responses:
 *       200:
 *         description: Test plan updated successfully
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
 *                   example: "Updated Test Plan Name"
 *                 description:
 *                   type: string
 *                   description: Description of the test plan
 *                   example: "Updated description for the test plan."
 *                 project_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the associated project
 *                       example: "67695bb6cfced1e07d82b370"
 *                     name:
 *                       type: string
 *                       description: Project name
 *                       example: "Updated Project Name"
 *                     description:
 *                       type: string
 *                       description: Updated project description
 *                       example: "Updated description of the project"
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
 *                   example: "At least one field must be provided for update"
 *       404:
 *         description: Test plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test plan not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, project_id } = req.body;

    // Validate input
    if (!name && !description && !project_id) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    // Build the update object
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (project_id) updates.project_id = project_id;

    updates.updated_at = Date.now(); // Update the timestamp

    // Update the Test Plan
    const updatedTestPlan = await TestPlan.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and run schema validation
    ).populate('project_id', 'name description');

    // Handle test plan not found
    if (!updatedTestPlan) {
      return res.status(404).json({ error: 'Test plan not found' });
    }

    // Respond with the updated test plan
    res.status(200).json(updatedTestPlan);
  } catch (err) {
    // Handle invalid ObjectId or other server errors
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/test-plans/{id}:
 *   delete:
 *     summary: Soft delete a test plan
 *     tags: [TestPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test plan to soft delete
 *     responses:
 *       200:
 *         description: Test plan soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Test plan soft deleted successfully"
 *                 testPlan:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the test plan
 *                       example: "60e8f8e5b9c3b3f51f16e13e"
 *                     name:
 *                       type: string
 *                       description: Name of the test plan
 *                       example: "User Registration Plan"
 *                     description:
 *                       type: string
 *                       description: Description of the test plan
 *                       example: "This plan tests user registration workflows."
 *                     project_id:
 *                       type: string
 *                       description: ID of the associated project
 *                       example: "60e8f8e5b9c3b3f51f16e13a"
 *                     isDeleted:
 *                       type: boolean
 *                       description: Indicates whether the test plan is soft-deleted
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the test plan was created
 *                       example: "2024-12-23T16:21:45.784Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the test plan was last updated
 *                       example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Test plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test plan not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Perform the soft delete
    const deletedTestPlan = await TestPlan.findByIdAndUpdate(
      id,
      { isDeleted: true, updated_at: Date.now() }, // Set isDeleted to true
      { new: true } // Return the updated document
    );

    // Handle test plan not found
    if (!deletedTestPlan) {
      return res.status(404).json({ error: 'Test plan not found' });
    }

    // Respond with success message and updated document
    res.status(200).json({
      message: 'Test plan soft deleted successfully',
      testPlan: deletedTestPlan,
    });
  } catch (err) {
    // Handle invalid ObjectId or other server errors
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
