const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  manager: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
