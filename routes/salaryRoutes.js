const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const Employee = require('../models/Employee');

// Protected GET
router.get('/', async (req, res) => {
  const employees = await Employee.find();
  console.log( 'sggs', employees);
  res.json(employees);
});

// Protected POST
router.post('/', async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.status(201).json(emp);
});

module.exports = router;
