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
  "mongodb+srv://rutendoking:pT8rmQjVvGXuNi24@cluster0.np0md1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

// Register Route with bcrypt
app.post("/register", async (req, res) => {
  try {
    const { name, email, account, id, password } = req.body;

    // Check if email is already registered
    const existingUser = await CustomerModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user with hashed password
    const newUser = new CustomerModel({
      name,
      email,
      account,
      id,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// Login Route with bcrypt verification and JWT
app.post("/login", bruteforce.prevent, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await CustomerModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Account does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "Login success", token });
    } else {
      res.status(400).json({ message: "Incorrect password!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
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
    const user = await CustomerModel.findById(decoded.id).select('name'); // Fetch only the name field

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
      
      // Find the user to check their balance
      const user = await CustomerModel.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Validate payment amount
      if (amount <= 0 || amount > user.balance) {
          return res.status(400).json({ message: "Invalid payment amount." });
      }

      // Create a new transaction
      const newTransaction = new TransactionModel({
          userId: user._id,
          recipientName,
          recipientBank,
          accountNumber,
          amount,
          swiftCode,
      });

      await newTransaction.save();

      // Deduct the amount from the user's balance
      user.balance -= amount;
      const updatedUser = await user.save();

      res.json({ 
          message: `Payment of R${amount} to ${recipientName} processed successfully.`,
          newBalance: updatedUser.balance // Include the new balance in the response
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


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
