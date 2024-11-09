// scripts/insertAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EmployeeModel = require('../models/Employee');

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const insertAdmin = async () => {
  try {
    const email = 'Admin@gmail.com';
    const password = 'All@1234';

    // Check if Admin already exists
    const existingAdmin = await EmployeeModel.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      mongoose.disconnect();
      return;
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin employee
    const newAdmin = new EmployeeModel({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log('Admin employee inserted successfully');
  } catch (error) {
    console.error('Error inserting admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

insertAdmin();
