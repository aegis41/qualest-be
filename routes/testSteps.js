const express = require('express');
const router = express.Router();
const TestStep = require('../models/TestStep');

/**
 * @swagger
 * /api/test-steps:
 *   post:
 *     summary: Create a new test step
 *     tags: [TestSteps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the test step
 *                 example: "Login to the application"
 *               description:
 *                 type: string
 *                 description: Detailed description of the test step
 *                 example: "Verify user can login with valid credentials."
 *               expected_result:
 *                 type: string
 *                 description: Expected outcome of the test step
 *                 example: "User successfully logged in."
 *               test_plan_id:
 *                 type: string
 *                 description: ID of the associated test plan
 *                 example: "67695bb6cfced1e07d82b370"
 *     responses:
 *       201:
 *         description: Test step created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the test step
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Name of the test step
 *                   example: "Login to the application"
 *                 description:
 *                   type: string
 *                   description: Description of the test step
 *                   example: "Verify user can login with valid credentials."
 *                 expected_result:
 *                   type: string
 *                   description: Expected outcome of the test step
 *                   example: "User successfully logged in."
 *                 test_plan_id:
 *                   type: string
 *                   description: ID of the associated test plan
 *                   example: "67695bb6cfced1e07d82b370"
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the test step is soft-deleted
 *                   example: false
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was last updated
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
 *                   example: "Test plan ID is required"
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
      const { name, description, expected_result, test_plan_id } = req.body;
  
      // Validate required fields
      if (!name || !test_plan_id) {
        return res.status(400).json({ error: 'Name and test plan ID are required' });
      }
  
      // Create the test step
      const testStep = new TestStep({
        name,
        description,
        expected_result,
        test_plan_id,
      });
  
      await testStep.save();
  
      res.status(201).json(testStep);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /api/test-steps:
 *   get:
 *     summary: Retrieve all test steps with pagination, sorting, and filtering
 *     tags: [TestSteps]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "name"
 *         description: Field to sort by (e.g., name, created_at)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "asc"
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: filterBy
 *         schema:
 *           type: string
 *           example: "name"
 *         description: Field to filter by
 *       - in: query
 *         name: filterTerm
 *         schema:
 *           type: string
 *           example: "Login to the application"
 *         description: Term to filter by
 *     responses:
 *       200:
 *         description: Successfully retrieved test steps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of test steps
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   description: Current page
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: Total pages available
 *                   example: 5
 *                 testSteps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the test step
 *                         example: "60e8f8e5b9c3b3f51f16e13e"
 *                       name:
 *                         type: string
 *                         description: Name of the test step
 *                         example: "Login to the application"
 *                       description:
 *                         type: string
 *                         description: Description of the test step
 *                         example: "Verify user can log in with valid credentials."
 *                       expected_result:
 *                         type: string
 *                         description: Expected result of the test step
 *                         example: "User successfully logged in."
 *                       test_plan_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID of the associated test plan
 *                             example: "67695bb6cfced1e07d82b370"
 *                           name:
 *                             type: string
 *                             description: Name of the test plan
 *                             example: "User Registration Tests"
 *                           description:
 *                             type: string
 *                             description: Description of the test plan
 *                             example: "Plan for testing user registration workflows."
 *                       isDeleted:
 *                         type: boolean
 *                         description: Indicates whether the test step is soft-deleted
 *                         example: false
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the test step was created
 *                         example: "2024-12-23T16:21:45.784Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the test step was last updated
 *                         example: "2024-12-23T16:21:52.933Z"
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
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', order = 'asc', filterBy, filterTerm } = req.query;
  
      const skip = (page - 1) * limit;
      const sortOrder = order === 'desc' ? -1 : 1;
  
      // Build the filter
      const filter = { isDeleted: false }; // Exclude soft-deleted records
      if (filterBy && filterTerm) {
        filter[filterBy] = { $regex: filterTerm, $options: 'i' }; // Case-insensitive regex search
      }
  
      // Count total documents matching the filter
      const total = await TestStep.countDocuments(filter);
  
      // Fetch documents with pagination, sorting, and populate test plan data
      const testSteps = await TestStep.find(filter)
        .populate('test_plan_id', 'name description') // Populate specific fields from TestPlan
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit));
  
      res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        testSteps,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
/**
 * @swagger
 * /api/test-steps/{id}:
 *   get:
 *     summary: Retrieve a single test step by ID
 *     tags: [TestSteps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test step to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the test step
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the test step
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Name of the test step
 *                   example: "Login to the application"
 *                 description:
 *                   type: string
 *                   description: Description of the test step
 *                   example: "Verify user can log in with valid credentials."
 *                 expected_result:
 *                   type: string
 *                   description: Expected result of the test step
 *                   example: "User successfully logged in."
 *                 test_plan_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the associated test plan
 *                       example: "67695bb6cfced1e07d82b370"
 *                     name:
 *                       type: string
 *                       description: Name of the test plan
 *                       example: "User Registration Tests"
 *                     description:
 *                       type: string
 *                       description: Description of the test plan
 *                       example: "Plan for testing user registration workflows."
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the test step is soft-deleted
 *                   example: false
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was last updated
 *                   example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Test step not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test step not found"
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
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the test step by ID, exclude soft-deleted records, and populate test plan data
      const testStep = await TestStep.findOne({ _id: id, isDeleted: false }).populate(
        'test_plan_id',
        'name description'
      );
  
      // Handle test step not found
      if (!testStep) {
        return res.status(404).json({ error: 'Test step not found' });
      }
  
      res.status(200).json(testStep);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
/**
 * @swagger
 * /api/test-steps/{id}:
 *   put:
 *     summary: Update a test step
 *     tags: [TestSteps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test step to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the test step
 *                 example: "Login to the application"
 *               description:
 *                 type: string
 *                 description: Updated description of the test step
 *                 example: "Verify user can log in with valid credentials."
 *               expected_result:
 *                 type: string
 *                 description: Updated expected outcome of the test step
 *                 example: "User successfully logged in."
 *     responses:
 *       200:
 *         description: Test step updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the test step
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Name of the test step
 *                   example: "Login to the application"
 *                 description:
 *                   type: string
 *                   description: Description of the test step
 *                   example: "Verify user can log in with valid credentials."
 *                 expected_result:
 *                   type: string
 *                   description: Expected result of the test step
 *                   example: "User successfully logged in."
 *                 test_plan_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the associated test plan
 *                       example: "67695bb6cfced1e07d82b370"
 *                     name:
 *                       type: string
 *                       description: Name of the test plan
 *                       example: "User Registration Tests"
 *                     description:
 *                       type: string
 *                       description: Description of the test plan
 *                       example: "Plan for testing user registration workflows."
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the test step is soft-deleted
 *                   example: false
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the test step was last updated
 *                   example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Test step not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test step not found"
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
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, expected_result } = req.body;
  
      // Validate that at least one field is provided
      if (!name && !description && !expected_result) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
      }
  
      // Build the update object
      const updates = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (expected_result) updates.expected_result = expected_result;
  
      updates.updated_at = Date.now(); // Update the timestamp
  
      // Update the test step, exclude soft-deleted records, and populate test plan data
      const updatedTestStep = await TestStep.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updates,
        { new: true, runValidators: true } // Return the updated document and validate updates
      ).populate('test_plan_id', 'name description');
  
      // Handle test step not found
      if (!updatedTestStep) {
        return res.status(404).json({ error: 'Test step not found' });
      }
  
      res.status(200).json(updatedTestStep);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

/**
 * @swagger
 * /api/test-steps/{id}:
 *   delete:
 *     summary: Soft delete a test step
 *     tags: [TestSteps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the test step to soft delete
 *     responses:
 *       200:
 *         description: Test step soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Test step soft deleted successfully"
 *                 testStep:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the test step
 *                       example: "60e8f8e5b9c3b3f51f16e13e"
 *                     name:
 *                       type: string
 *                       description: Name of the test step
 *                       example: "Login to the application"
 *                     description:
 *                       type: string
 *                       description: Description of the test step
 *                       example: "Verify user can log in with valid credentials."
 *                     isDeleted:
 *                       type: boolean
 *                       description: Indicates whether the test step is soft-deleted
 *                       example: true
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the test step was last updated
 *                       example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Test step not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Test step not found"
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
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Perform the soft delete
      const deletedTestStep = await TestStep.findOneAndUpdate(
        { _id: id, isDeleted: false }, // Ensure the test step is not already soft-deleted
        { isDeleted: true, updated_at: Date.now() }, // Mark as soft-deleted and update timestamp
        { new: true } // Return the updated document
      );
  
      // Handle test step not found
      if (!deletedTestStep) {
        return res.status(404).json({ error: 'Test step not found' });
      }
  
      res.status(200).json({
        message: 'Test step soft deleted successfully',
        testStep: deletedTestStep,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
