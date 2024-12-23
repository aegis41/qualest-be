const express = require('express');
const Permission = require('../models/Permission');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing permissions
 */

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
 *               name:
 *                 type: string
 *                 example: "view_projects"
 *               description:
 *                 type: string
 *                 example: "Allows viewing of projects"
 *               key:
 *                 type: string
 *                 example: "VWPRJ"
 *     responses:
 *       201:
 *         description: Permission created successfully
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, key } = req.body;

    const permission = new Permission({ name, description, key });
    await permission.save();

    res.status(201).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/', async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
