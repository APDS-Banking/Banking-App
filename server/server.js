const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// SSL Certificate
const options = {
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem') 
};

app.use(cors());
app.use(express.json());

// Your routes here
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'user@test.com' && password === 'password123') {
    return res.json({ token: 'mock-token' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });
}

module.exports = app; // Export the app for testing
