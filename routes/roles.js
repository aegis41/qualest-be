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
 *               isDetleted:
 *                 type: boolean
 *                 description: Set for soft deletes
 *               createdAt:
 *                 type: date
 *                 description: Date the role was created
 *               updatedAt:
 *                 type: date
 *                 description: Date the role was last updated
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
    if (!name || !key || !description || !permissions) {
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
 * /api/roles/{id}:
 *   get:
 *     summary: Retrieve a single role by ID
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67698e19fb25a1d1ae9f24f6"
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the role
 *                   example: "67698e19fb25a1d1ae9f24f6"
 *                 name:
 *                   type: string
 *                   description: Name of the role
 *                   example: "Admin"
 *                 key:
 *                   type: string
 *                   description: Unique key for the role
 *                   example: "ADMIN"
 *                 description:
 *                   type: string
 *                   description: Detailed description of the role
 *                   example: "Administrator role with full permissions"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of permission IDs associated with the role
 *                   example: ["61e8f8e5b9c3b3f51f16e13a", "61e8f8e5b9c3b3f51f16e13b"]
 *                 isDeleted:
 *                   type: boolean
 *                   description: Indicates whether the role is soft-deleted
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the role was created
 *                   example: "2024-12-23T16:21:45.784Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the role was last updated
 *                   example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Role not found"
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

    // find the role by ID
    const role = await Role.findById(id).populate('permissions');

    // handle not found
    if (!role) {
      return res.status(404).json({ error: `Role ID: ${id} not found`});
    }

    return res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ error: err.mesage });
  }
});

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Retrieve all roles with filtering and sorting
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: query
 *         name: filterBy
 *         schema:
 *           type: string
 *         description: Field to filter by (e.g., name, key)
 *       - in: query
 *         name: filterTerm
 *         schema:
 *           type: string
 *         description: Term to match in the filter field
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., name, key, createdAt). Default is "createdAt".
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order, either ascending ("asc") or descending ("desc"). Default is "asc".
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered and sorted list of roles
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
    const { sortBy = 'createdAt', order = 'asc', filterBy, filterTerm } = req.query;

    // build the filter object
    const filter = {};
    if (filterBy && filterTerm) {
      filter[filterBy] = { $regex: filterTerm, $options: 'i' }; // case=insensitive regex
    }

    // Build the sorting object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Retrieve sorted roles
    const roles = await Role.find(filter).sort(sort);

    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update an existing role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67698e19fb25a1d1ae9f24f6"
 *         description: The ID of the role to update
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
 *                 example: "Manager"
 *               key:
 *                 type: string
 *                 description: Unique key for the role
 *                 example: "MGR"
 *               description:
 *                 type: string
 *                 description: Detailed description of the role
 *                 example: "This role is for team managers"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission IDs associated with the role
 *                 example: ["61e8f8e5b9c3b3f51f16e13a", "61e8f8e5b9c3b3f51f16e13b"]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the role
 *                   example: "67698e19fb25a1d1ae9f24f6"
 *                 name:
 *                   type: string
 *                   description: Name of the role
 *                   example: "Manager"
 *                 key:
 *                   type: string
 *                   description: Unique key for the role
 *                   example: "MGR"
 *                 description:
 *                   type: string
 *                   description: Detailed description of the role
 *                   example: "This role is for team managers"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of permission IDs associated with the role
 *                   example: ["61e8f8e5b9c3b3f51f16e13a", "61e8f8e5b9c3b3f51f16e13b"]
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
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Role not found"
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
    const { name, key, description, permissions } = req.body;

    // Validate that at least one field is being updated
    if (!name && !key && !description && !permissions) {
      return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    // Validate permissions if provided
    if (permissions) {
      const permissionDocs = await Permission.find({ _id: { $in: permissions } });
      if (permissionDocs.length !== permissions.length) {
        return res.status(400).json({ error: 'Invalid permissions provided' });
      }
    }

    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (key) updates.key = key;
    if (description) updates.description = description;
    if (permissions) updates.permissions = permissions;

    updates.updatedAt = Date.now(); // Update the timestamp

    // Find and update the role
    const updatedRole = await Role.findOneAndUpdate(
      { _id: id },
      updates,
      { new: true, runValidators: true }
    );
    console.log(updatedRole);

    // Handle not found
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Return the updated role
    res.status(200).json({
      message: 'Role updated successfully',
      role: updatedRole,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key or name error
      return res.status(400).json({ error: 'Role name or key must be unique' });
    } else {
      return res.status(500).json({ error: err.message });
    }
  }
});


/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Soft delete a role
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "67698e19fb25a1d1ae9f24f6"
 *         description: The ID of the role to soft delete
 *     responses:
 *       200:
 *         description: Role soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role soft deleted successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the role
 *                       example: "67698e19fb25a1d1ae9f24f6"
 *                     name:
 *                       type: string
 *                       description: Name of the role
 *                       example: "Admin"
 *                     key:
 *                       type: string
 *                       description: Unique key for the role
 *                       example: "ADMIN"
 *                     description:
 *                       type: string
 *                       description: Detailed description of the role
 *                       example: "Administrator role with full permissions"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of permission IDs associated with the role
 *                       example: ["61e8f8e5b9c3b3f51f16e13a", "61e8f8e5b9c3b3f51f16e13b"]
 *                     isDeleted:
 *                       type: boolean
 *                       description: Indicates whether the role is soft-deleted
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the role was created
 *                       example: "2024-12-23T16:21:45.784Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the role was last updated
 *                       example: "2024-12-23T16:21:52.933Z"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Role not found"
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

    // Find and soft delete the role
    const updatedRole = await Role.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    // Handle not found
    if (!updatedRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.status(200).json({
      message: 'Role soft deleted successfully',
      role: updatedRole,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
