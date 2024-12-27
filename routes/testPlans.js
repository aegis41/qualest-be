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
 * /api/test-plans:
 *   post:
 *     summary: Create a new test plan
 *     tags: [TestPlans]
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
 *                   example: "Name and project_id are required"
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
    const { name, description, project_id } = req.body;

    // Validate required fields
    if (!name || !project_id) {
      return res.status(400).json({ error: 'Name and project_id are required' });
    }

    // Create the test plan
    const testPlan = new TestPlan({
      name,
      description,
      project_id,
    });

    await testPlan.save();

    res.status(201).json(testPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/test-plans:
 *   get:
 *     summary: Retrieve all test plans with pagination, sorting, and filtering
 *     tags: [TestPlans]
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
 *           example: "User Registration Plan"
 *         description: Term to filter by
 *     responses:
 *       200:
 *         description: Successfully retrieved test plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of test plans
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   description: Current page
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: Total pages available
 *                   example: 5
 *                 testPlans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the test plan
 *                         example: "60e8f8e5b9c3b3f51f16e13e"
 *                       name:
 *                         type: string
 *                         description: Name of the test plan
 *                         example: "User Registration Plan"
 *                       description:
 *                         type: string
 *                         description: Description of the test plan
 *                         example: "This plan tests user registration workflows."
 *                       project_id:
 *                         type: string
 *                         description: ID of the associated project
 *                         example: "67695bb6cfced1e07d82b370"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the test plan was created
 *                         example: "2024-12-23T16:21:45.784Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the test plan was last updated
 *                         example: "2024-12-23T16:21:52.933Z"
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'created_at', order = 'asc', filterBy, filterTerm } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Build the filter
    const filter = {};
    if (filterBy && filterTerm) {
      filter[filterBy] = { $regex: filterTerm, $options: 'i' }; // Case-insensitive regex search
    }

    const total = await TestPlan.countDocuments(filter);
    const testPlans = await TestPlan.find(filter).sort(sort).skip(skip).limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      testPlans,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
