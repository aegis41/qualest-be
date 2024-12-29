const mongoose = require('mongoose');

const TestStepSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Step title or short name
  description: { type: String }, // Detailed description of the step
  expected_result: { type: String }, // Expected outcome of the step
  test_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPlan', required: true }, // Associated Test Plan
  isDeleted: { type: Boolean, default: false }, // Soft-delete flag
  created_at: { type: Date, default: Date.now }, // Creation timestamp
  updated_at: { type: Date, default: Date.now }, // Last updated timestamp
});

// Middleware to update `updated_at` before saving
TestStepSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Optional: Add an index on frequently searched fields
TestStepSchema.index({ name: 1 });

module.exports = mongoose.model('TestStep', TestStepSchema);
