const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const seedPermissions = require('./seedPermissions'); // Import seed permissions

dotenv.config();

/**
 * Function to reset permissions.
 * @param {boolean} preserveReferentialIntegrity - Whether to preserve role-permission relationships.
 */
const resetPermissions = async (preserveReferentialIntegrity = true) => {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Step 2: Cache existing permissions if preserving referential integrity
    let cachedPermissions = [];
    if (preserveReferentialIntegrity) {
      cachedPermissions = await Permission.find(); // Fetch all permissions
      console.log(`Cached ${cachedPermissions.length} permissions for referential integrity.`);
    }

    // Step 3: Drop the permissions collection
    await Permission.collection.drop().catch((err) => {
      if (err.code === 26) {
        console.log('Permissions collection does not exist. Skipping drop step.');
      } else {
        throw err;
      }
    });
    console.log('Permissions collection dropped.');

    // Step 4: Re-insert cached permissions (if any) and reset permissions
    if (preserveReferentialIntegrity && cachedPermissions.length > 0) {
      await Permission.insertMany(cachedPermissions); // Reinsert cached permissions
      console.log(`Reinserted ${cachedPermissions.length} cached permissions.`);
    }

    // Step 5: Insert reset permissions
    await Permission.insertMany(seedPermissions); // Insert seed permissions
    console.log(`Inserted ${seedPermissions.length} reset permissions.`);

    console.log('Reset permissions complete.');
  } catch (err) {
    console.error('Error during permissions reset:', err);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Execute the script
const preserveReferentialIntegrity = process.argv.includes('--preserve');
resetPermissions(preserveReferentialIntegrity);
