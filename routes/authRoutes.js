const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashed });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
  

module.exports = router;
