const https = require('https');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// SSL Certificate options
const options = {
  key: fs.readFileSync('keys/privatekey.pem'), // Private Key
  cert: fs.readFileSync('keys/certificate.pem') // SSL Certificate
};

app.use(cors(
  {
    origin: "https://localhost:5173", 
    credentials: true 
}
));
app.use(express.json());

// Example login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'user@test.com' && password === 'password123') {
    return res.json({ token: 'mock-token' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});


if (process.env.NODE_ENV !== 'test') {
  https.createServer(options, app).listen(3001, () => {
    console.log('Server running on https://localhost:3001');
  });
}

module.exports = app;
