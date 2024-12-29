const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
});

// middleware to updated `updatedAt` on save
RoleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Role', RoleSchema);
