 require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const CustomerModel = require("./models/Customer");
const helmet = require("helmet");
const ExpressBrute = require("express-brute");
const jwt = require("jsonwebtoken");
const TransactionModel = require('./models/Transaction');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

mongoose.connect(
  "mongodb+srv://shamisokasekesk:9w6TI2eOXGHW4INd@cluster0.dopxwyl.mongodb.net/customer?retryWrites=true&w=majority&appName=Cluster0"
);

// Brute force protection
const store = new ExpressBrute.MemoryStore();
// JWT Secret Key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
// Initialize Express Brute
const bruteforce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 5000,
  maxWait: 60000,
  failCallback: (req, res, next, options) => {
    res.status(429).send('Too many requests, please try again later.');
  }
});

// Login Route with bcrypt verification and JWT
app.post("/login", bruteforce.prevent, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find customer by email
    const customer = await CustomerModel.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Customer login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch customer details route
app.get('/customer', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    const user = await CustomerModel.findById(decoded.id).select('name account'); // Fetch both name and account fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send back the customer details
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err });
  }
});


// Payment processing route
app.post("/payment", async (req, res) => {
  const { recipientName, recipientBank, accountNumber, amount, swiftCode } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await CustomerModel.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (amount <= 0 || amount > user.balance) {
          return res.status(400).json({ message: "Invalid payment amount." });
      }

      const newTransaction = new TransactionModel({
          userId: user._id,
          recipientName,
          recipientBank,
          accountNumber,
          amount,
          swiftCode,
          status: 'Pending', // Set status to 'Pending'
      });
      await newTransaction.save();
      res.json({
          message: `Payment of R${amount} to ${recipientName} initiated successfully and is pending approval.`,
      });
  } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment. Please try again." });
  }
});

// Fetch user's transactions route
app.get("/transactions", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Fetch transactions for the logged-in user
      const transactions = await TransactionModel.find({ userId: decoded.id });
      res.json(transactions); // Send back the list of transactions
  } catch (err) {
      res.status(500).json({ message: 'Error fetching transactions', error: err });
  }
});

// Route to update transaction status (approve/reject)
app.put('/transactions/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
      const transaction = await TransactionModel.findById(req.params.id);
      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }

      if (transaction.status !== 'Pending') {
          return res.status(400).json({ message: 'Only pending transactions can be updated' });
      }

      transaction.status = status;
      await transaction.save();
      res.json({ message: `Transaction ${status.toLowerCase()} successfully`, transaction });
  } catch (error) {
      res.status(500).json({ message: 'Error updating transaction status', error });
  }
});

// Fetch only pending transactions for employees
app.get('/employee/transactions', async (req, res) => {
  try {
      const transactions = await TransactionModel.find({ status: 'Pending' });
      res.json(transactions);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Route to submit an approved transaction to SWIFT
app.post('/transactions/:id/submit-swift', async (req, res) => {
  try {
      const transaction = await TransactionModel.findById(req.params.id);
      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }

      if (transaction.status !== 'Approved') {
          return res.status(400).json({ message: 'Only approved transactions can be submitted to SWIFT' });
      }

      transaction.status = 'Submitted to SWIFT';
      await transaction.save();
      res.json({ message: 'Transaction submitted to SWIFT', transaction });
  } catch (error) {
      res.status(500).json({ message: 'Error submitting transaction to SWIFT', error });
  }
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
