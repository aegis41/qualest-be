const mongoose = require('mongoose');

const TestPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  isDeleted: { type: Boolean, default: false }, // add isDeleted field
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// middleware to updated `updatedAt` on save
TestPlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TestPlan', TestPlanSchema);
