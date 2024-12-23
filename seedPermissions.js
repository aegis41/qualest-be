const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('./models/Permission');

dotenv.config();

const permissions = [
  { 
    name: 'view_projects', 
    key: 'vwprj', 
    description: 'Can view projects' 
  },
  { 
    name: 'create_projects', 
    key: 'crtpr', 
    description: 'Can create projects' 
  },
  { 
    name: 'update_projects', 
    key: 'updpr', 
    description: 'Can update projects' 
  },
  { 
    name: 'delete_projects', 
    key: 'dltpr', 
    description: 'Can delete projects' 
  },
  { 
    name: 'view_test_plans', 
    key: 'vwttp', 
    description: 'Can view test plans' 
  },
  { 
    name: 'create_test_plans', 
    key: 'crtpt', 
    description: 'Can create test plans' 
  },
  { 
    name: 'update_test_plans', 
    key: 'updpt', 
    description: 'Can update test plans' 
  },
  { 
    name: 'delete_test_plans', 
    key: 'dltpt', 
    description: 'Can delete test plans' 
  }
];


mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Permission.insertMany(permissions);
    console.log('Permissions seeded');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
