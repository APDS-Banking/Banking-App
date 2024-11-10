const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Employee login route
router.post('/employee/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find employee by email in MongoDB
    const employee = await EmployeeModel.findOne({ email });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: employee._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Employee login successful', token });
  } catch (error) {
    console.error('Error during employee login:', error);
    res.status(500).json({ message: 'Login error, please try again later.' });
  }
});

module.exports = router;