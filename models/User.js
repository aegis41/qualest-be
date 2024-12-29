const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full name of the user
  email: { type: String, required: true, unique: true }, // Unique email address
  password: { type: String }, // Encrypted password for local authentication
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Array of Role IDs
  provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' }, // OAuth provider
  oauth_id: { type: String }, // Unique ID from the OAuth provider
  isDeleted: { type: Boolean, default: false }, // Soft-delete flag
  created_at: { type: Date, default: Date.now }, // Creation timestamp
  updated_at: { type: Date, default: Date.now }, // Last updated timestamp
});

// Middleware to update `updated_at` before saving
UserSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
