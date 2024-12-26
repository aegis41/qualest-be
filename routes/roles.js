const express = require('express');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the role
 *                 example: "Tester"
 *               key:
 *                 type: string
 *                 description: Unique key for the role
 *                 example: "TESTR"
 *               description:
 *                 type: string
 *                 description: Detailed description of the role
 *                 example: "This role is for people performing evaluations for QA."
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission IDs associated with the role
 *                 example: ["id_001-af2a02e37f43", "id_bob"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the role
 *                   example: "role_01"
 *                 name:
 *                   type: string
 *                   description: Name of the role
 *                   example: "Tester"
 *                 key:
 *                   type: string
 *                   description: Unique key for the role
 *                   example: "TESTR"
 *                 description:
 *                   type: string
 *                   description: Detailed description of the role
 *                   example: "This role is for people performing evaluations for QA."
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of permission IDs associated with the role
 *                   example: ["id_001-af2a02e37f43", "id_bob"]
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid permissions provided"
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
    const { name, key, description, permissions } = req.body;

    // Validate required fields
    if (!name || !key || !description || !permissions || !permissions.length) {
      return res.status(400).json({ error: 'Name, key, description, and permissions are required' });
    }

    // Validate permissions
    const permissionDocs = await Permission.find({ _id: { $in: permissions } });
    if (permissionDocs.length !== permissions.length) {
      return res.status(400).json({ error: 'Invalid permissions provided' });
    }

    // Check for duplicate name or key
    const existingRole = await Role.findOne({ $or: [{ name }, { key }] });
    if (existingRole) {
      return res.status(400).json({ error: 'Role name or key already exists' });
    }

    // Create and save the role
    const role = new Role({ name, key, description, permissions });
    await role.save();

    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Retrieve all roles with sorting
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "name"
 *         description: Field to sort by (e.g., name, key, createdAt). Default is "createdAt".
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "asc"
 *         description: Sort order, either ascending ("asc") or descending ("desc"). Default is "asc".
 *     responses:
 *       200:
 *         description: Successfully retrieved sorted list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the role
 *                     example: "67698e19fb25a1d1ae9f24f6"
 *                   name:
 *                     type: string
 *                     description: Name of the role
 *                     example: "Admin"
 *                   key:
 *                     type: string
 *                     description: Unique key for the role
 *                     example: "ADMIN"
 *                   description:
 *                     type: string
 *                     description: Detailed description of the role
 *                     example: "Administrator role with full permissions"
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of permission IDs associated with the role
 *                     example: ["61e8f8e5b9c3b3f51f16e13a", "61e8f8e5b9c3b3f51f16e13b"]
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



router.get('/', async (req, res) => {
  try{
    const { sortBy = 'createdAt', order = 'asc' } = req.query;

    // Build the sorting object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Retrieve sorted roles
    const roles = await Role.find().sort(sort);

    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
