const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

dotenv.config();

const seedData = [
  { name: "Alice Johnson", hours: 160, rate: 30, tax: 10 },
  { name: "Bob Smith", hours: 150, rate: 28, tax: 12 },
  { name: "Charlie Davis", hours: 170, rate: 32, tax: 8 },
  { name: "Diana Prince", hours: 165, rate: 35, tax: 9 }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Employee.deleteMany({});
    await Employee.insertMany(seedData);
    console.log("✅ Database seeded with sample employees!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDB();
