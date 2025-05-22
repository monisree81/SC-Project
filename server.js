const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes
const salaryRoutes = require('./routes/salaryRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route setup
app.use('/api/employees', salaryRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGO_URI); // Debug line
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected...');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
