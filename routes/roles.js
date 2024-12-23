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
 *                 example: "Tester"
 *               key:
 *                 type: string
 *                 example: "TESTR"
 *               description:
 *                 type: string
 *                 example: "This role is for people performing evaluations for QA."
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["id_001-af2a02e37f43", "id_bob"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "role_01"
 *                 name:
 *                   type: string
 *                   example: "Tester"
 *                 key:
 *                   type: string
 *                   example: "TESTR"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 */

router.post('/', async (req, res) => {
  try {
    const { name, key, permissions } = req.body;

    // Validate permissions
    const permissionDocs = await Permission.find({ _id: { $in: permissions } });
    if (permissionDocs.length !== permissions.length) {
      return res.status(400).json({ error: 'Invalid permissions provided' });
    }

    const role = new Role({ name, key, permissions });
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
 *     summary: Retrieve all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
