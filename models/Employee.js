const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  hours: Number,
  rate: Number,
  tax: Number
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
