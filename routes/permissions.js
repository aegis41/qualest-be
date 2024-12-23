const express = require('express');
const Permission = require('../models/Permission');

const router = express.Router();

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Number of results per page (default: 10)"
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: "Total number of permissions"
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   description: "Current page number"
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: "Total number of pages"
 *                   example: 5
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: "Unique identifier for the permission"
 *                         example: "67698e19fb25a1d1ae9f24f6"
 *                       key:
 *                         type: string
 *                         description: "Unique key for the permission"
 *                         example: "vwprj"
 *                       description:
 *                         type: string
 *                         description: "Description of the permission"
 *                         example: "Can view projects"
 *                       isDeleted:
 *                         type: boolean
 *                         description: "Indicates whether the permission is soft-deleted"
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Timestamp when the permission was created"
 *                         example: "2024-12-23T16:21:45.784Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Timestamp when the permission was last updated"
 *                         example: "2024-12-23T16:21:52.933Z"
 *       500:
 *         description: "Internal server error"
 */

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy, order = 'asc', filterBy, filterTerm, deleted = false } = req.query;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (filterBy && filterTerm) {
      filter[filterBy] = { $regex: filterTerm, $options: 'i' }; // Case-insensitive regex search
    }
    if (!deleted) {
      filter.isDeleted = false; // Exclude soft-deleted records by default
    }

    // Build sorting object
    const sortOrder = sortBy ? { [sortBy]: order === 'asc' ? 1 : -1 } : { createdAt: 1 };

    // Fetch total count and filtered records
    const total = await Permission.countDocuments(filter);
    const permissions = await Permission.find(filter).sort(sortOrder).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      permissions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67698e19fb25a1d1ae9f24f6"
 *         description: The unique identifier of the permission
 *     responses:
 *       200:
 *         description: A single permission object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the permission
 *                   example: "67698e19fb25a1d1ae9f24f6"
 *                 key:
 *                   type: string
 *                   description: The unique key for the permission
 *                   example: "vwprj"
 *                 description:
 *                   type: string
 *                   description: Description of the permission
 *                   example: "Can view projects"
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the permission is soft-deleted
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the permission was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the permission was last updated
 *                   example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Permission not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Permission not found"
 *       500:
 *         description: Internal server error
*/
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch the permission by ID
    const permission = await Permission.findById(id);
    
    // Handle not found
    if (!permission || permission.isDeleted) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    
    res.status(200).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Unique identifier for the permission
 *                 example: "vwprj"
 *               name:
 *                 type: string
 *                 description: Human-readable name for the permission
 *                 example: "view-projects"
 *               description:
 *                 type: string
 *                 description: Description of the permission
 *                 example: "Allows viewing of projects"
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the permission
 *                   example: "67698e19fb25a1d1ae9f24f6"
 *                 key:
 *                   type: string
 *                   description: Unique key for the permission
 *                   example: "vwprj"
 *                 name:
 *                   type: string
 *                   description: Name for the permission
 *                   example: "view-projects"
 *                 description:
 *                   type: string
 *                   description: Description of the permission
 *                   example: "Allows viewing of projects"
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the permission is soft-deleted
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the permission was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the permission was last updated
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
 *                   description: Error message
 *                   example: "Permission key and name must be unique"
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const { key, name, description } = req.body;

    // Validate request body
    if (!key || !name) {
      return res.status(400).json({ error: 'Key and name are required' });
    }

    // Create the permission
    const permission = new Permission({ key, name, description });
    await permission.save();

    res.status(201).json(permission);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key or name error
      res.status(400).json({ error: 'Permission key and name must be unique' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});


module.exports = router;