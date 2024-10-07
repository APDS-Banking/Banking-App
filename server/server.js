const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

// SSL Certificate
const options = {
  key: fs.readFileSync('path/to/privatekey.pem'),
  cert: fs.readFileSync('path/to/certificate.pem') 
};

// Define routes
app.get('/', (req, res) => {
  res.send('Secure Server');
});

// Create HTTPS server
https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS Server running on port 3000');
});
