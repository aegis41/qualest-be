const mongoose = require('mongoose');

const TestPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  steps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestStep' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestPlan', TestPlanSchema);
