const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  key: { type: String, required: true, unique: true }, // New field
});

module.exports = mongoose.model('Permission', PermissionSchema);
