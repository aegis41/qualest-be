const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');
const Permission = require('./models/Permission');

// Load environment variables
dotenv.config();

/**
 * Function to find all unique permissions used in roles.
 */
const findUniquePermissionsWithRoles = async () => {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Step 2: Fetch all roles
    const roles = await Role.find(); // Get all roles with their permission references
    console.log(`Fetched ${roles.length} roles from the database.`);

    // Step 3: Gather all permission IDs
    const allPermissionIDs = roles.flatMap((role) => role.permissions); // Flatten all permissions into one array
    console.log(`Found ${allPermissionIDs.length} total permission references.`);

    // Step 4: Reduce to unique IDs
    const uniquePermissionIDs = [...new Set(allPermissionIDs.map((id) => id.toString()))]; // Deduplicate IDs
    console.log(`Reduced to ${uniquePermissionIDs.length} unique permission IDs.`);

    // Step 5: Fetch full permission records
    const permissions = await Permission.find({ _id: { $in: uniquePermissionIDs } }); // Fetch full records
    console.log(`Retrieved ${permissions.length} unique permissions from the database.`);

    // Step 6: Output the permissions
    console.log('Unique Permissions:', permissions);

    return permissions;
  } catch (err) {
    console.error('Error finding unique permissions:', err);
    process.exit(1);
  } finally {
    // Ensure the connection is closed after the operation
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Execute the function
findUniquePermissionsWithRoles();
