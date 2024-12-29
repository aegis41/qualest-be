const express = require('express');
const router = express.Router();
const User = require('../models/User');

/*
    PPPPPPPP       OOOOOOOO      SSSSSSS    TTTTTTTTTT
    PP     PP     OO      OO    SS     SS       TT
    PP     PP     OO      OO      SS            TT
    PPPPPPPP      OO      OO        SS          TT
    PP            OO      OO          SS        TT
    PP            OO      OO    SS     SS       TT
    PP             OOOOOOOO      SSSSSSS        TT
*/

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Encrypted password for local authentication
 *                 example: "hashedpassword123"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Role IDs assigned to the user
 *                 example: ["60e8f8e5b9c3b3f51f16e13e", "60e8f8e5b9c3b3f51f16e13f"]
 *               provider:
 *                 type: string
 *                 enum: [local, google, github]
 *                 description: Authentication provider
 *                 example: "local"
 *               oauth_id:
 *                 type: string
 *                 description: OAuth provider ID (for Google/GitHub users)
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Full name of the user
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   example: "john.doe@example.com"
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of Role IDs assigned to the user
 *                   example: ["60e8f8e5b9c3b3f51f16e13e", "60e8f8e5b9c3b3f51f16e13f"]
 *                 provider:
 *                   type: string
 *                   description: Authentication provider
 *                   example: "local"
 *                 oauth_id:
 *                   type: string
 *                   description: OAuth provider ID
 *                   example: "1234567890"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is required"
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
      const { name, email, password, roles, provider, oauth_id } = req.body;
  
      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
  
      // Check for existing user with the same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Validate roles if provided
      if (roles && roles.length > 0) {
        const validRoles = await Role.find({ _id: { $in: roles } });
        if (validRoles.length !== roles.length) {
          return res.status(400).json({ error: 'Invalid role IDs provided' });
        }
      }
  
      // Create the new user
      const user = new User({
        name,
        email,
        password, // Assume password is already hashed if provided
        roles: roles || [], // Array of role IDs
        provider: provider || 'local',
        oauth_id: oauth_id || null,
      });
  
      await user.save();
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/*
    GGGGGGGG       EEEEEEEE       TTTTTTTTTT
    GG             EE                 TT
    GG             EE                 TT
    GG   GGG       EEEEEEE            TT
    GG     GG      EE                 TT
    GG     GG      EE                 TT
    GGGGGGGG       EEEEEEEE           TT
*/



/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user and their calculated permissions
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user with permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Full name of the user
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   example: "john.doe@example.com"
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: Array of roles assigned to the user
 *                   example: ["admin", "tester"]
 *                 effectivePermissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Calculated permissions based on assigned roles
 *                   example: ["view_projects", "execute_tests"]
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID and populate roles and their permissions
    const user = await User.findById(id)
      .populate({
        path: 'roles',
        populate: {
          path: 'permissions', // Populate permissions within each role
          select: 'key', // Only include the `key` field from permissions
        },
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate effective permissions from roles
    const effectivePermissions = user.roles.flatMap((role) =>
      role.permissions.map((perm) => perm.key)
    );

    res.status(200).json({
      ...user.toObject(),
      effectivePermissions: [...new Set(effectivePermissions)], // Deduplicate permissions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a paginated, sorted, and filtered list of users
 *     tags: 
 *       - Users
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
 *         description: Field to sort by (e.g., name, email, created_at)
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
 *           example: "John"
 *         description: Term to search for in the filter field
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of users
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   description: Current page
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the user
 *                         example: "60e8f8e5b9c3b3f51f16e13e"
 *                       name:
 *                         type: string
 *                         description: Full name of the user
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: Email address of the user
 *                         example: "john.doe@example.com"
 *                       roles:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             permissions:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               description: Permission keys
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: User creation timestamp
 *                         example: "2024-01-01T10:00:00Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Last update timestamp
 *                         example: "2024-01-01T10:00:00Z"
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', order = 'asc', filterBy, filterTerm } = req.query;
  
      const skip = (page - 1) * limit;
      const sortOrder = order === 'desc' ? -1 : 1;
  
      // Build filter object
      const filter = { isDeleted: false };
      if (filterBy && filterTerm) {
        filter[filterBy] = { $regex: filterTerm, $options: 'i' }; // Case-insensitive regex search
      }
  
      // Count total users matching the filter
      const total = await User.countDocuments(filter);
  
      // Fetch users with pagination and sorting
      const users = await User.find(filter)
        .populate({
          path: 'roles',
          populate: {
            path: 'permissions',
            select: 'key',
          },
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit));
  
      res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user
 *                 example: "John Updated"
 *               email:
 *                 type: string
 *                 description: Updated email of the user
 *                 example: "updated.john.doe@example.com"
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of updated Role IDs assigned to the user
 *                 example: ["60e8f8e5b9c3b3f51f16e13e"]
 *               provider:
 *                 type: string
 *                 enum: [local, google, github]
 *                 description: Updated authentication provider
 *                 example: "google"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the user
 *                   example: "60e8f8e5b9c3b3f51f16e13e"
 *                 name:
 *                   type: string
 *                   description: Updated full name of the user
 *                   example: "John Updated"
 *                 email:
 *                   type: string
 *                   description: Updated email of the user
 *                   example: "updated.john.doe@example.com"
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Updated roles assigned to the user
 *                   example: ["60e8f8e5b9c3b3f51f16e13e"]
 *                 provider:
 *                   type: string
 *                   description: Updated authentication provider
 *                   example: "google"
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, roles, provider } = req.body;
  
      // Validate at least one field to update
      if (!name && !email && !roles && !provider) {
        return res.status(400).json({ error: 'At least one field must be provided for update' });
      }
  
      // Build update object
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (roles) {
        const validRoles = await Role.find({ _id: { $in: roles } });
        if (validRoles.length !== roles.length) {
          return res.status(400).json({ error: 'Invalid role IDs provided' });
        }
        updates.roles = roles;
      }
      if (provider) updates.provider = provider;
  
      updates.updated_at = Date.now(); // Update timestamp
  
      // Update user by ID
      const updatedUser = await User.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updates,
        { new: true, runValidators: true }
      ).populate({
        path: 'roles',
        populate: {
          path: 'permissions',
          select: 'key',
        },
      });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete or undelete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60e8f8e5b9c3b3f51f16e13e"
 *         description: The ID of the user to soft delete or undelete
 *       - in: query
 *         name: undelete
 *         schema:
 *           type: boolean
 *           example: false
 *         description: If true, undeletes the user by setting `isDeleted` to false
 *     responses:
 *       200:
 *         description: User soft deleted or undeleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User soft deleted successfully"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { undelete } = req.query;

        // Determine update payload based on undelete flag
        const update = undelete === 'true'
        ? { isDeleted: false, updated_at: Date.now() }
        : { isDeleted: true, updated_at: Date.now() };

        // Perform soft delete or undelete
        const updatedUser = await User.findOneAndUpdate(
            { _id: id, isDeleted: undelete === 'true' ? true : false }, // Ensure undelete targets only deleted users
            update,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: undelete === 'true'
            ? 'User undeleted successfully'
            : 'User soft deleted successfully',
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;