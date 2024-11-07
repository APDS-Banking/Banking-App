const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const app = express();

const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
};

app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Mock Employee Data (normally you'd retrieve this from a database)
const employees = [
  {
    id: 1,
    email: 'employee@example.com',
    password: '$2b$10$7aW8kjfofn8mn3x33g3ZTOe3d7XWzvWxl4kGz.gFiIvYGScZOkcCa' // bcrypt-hashed password
  }
];

// Employee login route
app.post('/employee/login', async (req, res) => {
  const { email, password } = req.body;

  // Find employee by email
  const employee = employees.find(emp => emp.email === email);
  if (!employee) return res.status(401).json({ message: 'Invalid email or password.' });

  // Compare password
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

  // Generate JWT
  const token = jwt.sign({ id: employee.id }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token });
});

https.createServer(options, app).listen(3001, () => {
  console.log('Server running on https://localhost:3001');
});
