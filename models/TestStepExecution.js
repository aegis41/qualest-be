const mongoose = require('mongoose');

const TestStepExecutionSchema = new mongoose.Schema({
  test_step_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestStep', required: true },  // Reference to the executed step
  executed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                       // User who executed the step
  executed_at: { type: Date, default: Date.now },                                           // Timestamp of execution
  status: { type: String, enum: ['not_executed', 'pass', 'fail', 'skipped'], default: 'not_executed' }, // Execution result
  actual_result: { type: String },                                                          // Actual outcome of the execution
  notes: { type: String },                                                                  // Additional notes about the execution
  isDeleted: { type: Boolean, default: false},                                              // soft delete flag
  created_at: { type: Date, default: Date.now },                                            // Creation timestamp
  updated_at: { type: Date, default: Date.now },                                            // Last updated timestamp
});

// Middleware to update `updated_at` before saving
TestStepExecutionSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('TestStepExecution', TestStepExecutionSchema);
