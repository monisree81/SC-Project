const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/authMiddleware');

// GET all employees (requires token)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new employee (requires token)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, hours, rate, tax } = req.body;

    // Validate input
    if (!name || isNaN(hours) || isNaN(rate) || isNaN(tax)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const newEmployee = new Employee({ name, hours, rate, tax });
    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding employee:', err.message);
    res.status(500).json({ message: 'Could not add employee' });
  }
});
module.exports = router;
