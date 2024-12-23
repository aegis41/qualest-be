const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Retrieve all projects with pagination, filtering, and sorting
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of results per page (default is 10)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by project name (case-insensitive)
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by project description (case-insensitive)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., name, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc for ascending, desc for descending)
 *     responses:
 *       200:
 *         description: List of projects with pagination, filtering, and sorting info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, name, description, sortBy, order } = req.query;

    // Filters
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive filter
    if (description) filter.description = { $regex: description, $options: 'i' };

    // Sorting
    const sortOrder = sortBy
      ? { [sortBy]: order === 'desc' ? -1 : 1 }
      : { createdAt: 1 }; // Default: sort by createdAt ascending

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch projects
    const projects = await Project.find(filter).sort(sortOrder).skip(skip).limit(parseInt(limit));

    // Count total documents matching the filter
    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages,
      projects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/projects/search:
 *   post:
 *     summary: Search projects with advanced filtering, sorting, and pagination
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pagination:
 *                 type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   limit:
 *                     type: integer
 *                     example: 10
 *               filters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: "name"
 *                     term:
 *                       type: string
 *                       example: "test"
 *               sort:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                       example: "name"
 *                     order:
 *                       type: string
 *                       enum:
 *                         - asc
 *                         - desc
 *                       example: "asc"
 *     responses:
 *       200:
 *         description: List of projects with pagination, filtering, and sorting info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching projects
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */

router.post('/search', async (req, res) => {
  try {
    const { pagination = {}, filters = [], sort = [] } = req.body;

    // Extract pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Build the MongoDB filter object
    const mongoFilter = filters.reduce((acc, { key, term }) => {
      if (key && term) {
        acc[key] = { $regex: term, $options: 'i' } // case-insensitive regex search
      }
      return acc;
    }, {});

    // Build sorting object
    const sortOrder = sort.reduce((acc, { field, order }) => {
      acc[field] = order === 'asc' ? 1 : -1;
      return acc;
    }, {});

    // Query the database
    const projects = await Project.find(mongoFilter).sort(sortOrder).skip(skip).limit(limit);

    // Count total documents matching filter
    const total = await Project.countDocuments(mongoFilter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      request: {
        pagination: { page, limit },
        filters,
        sort
      },
      total,
      page,
      totalPages,
      projects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Retrieve a project by its ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: A single project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Project not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Return the project
    res.status(200).json(project);
  } catch (err) {
    // Handle invalid IDs or other errors
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Project"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
