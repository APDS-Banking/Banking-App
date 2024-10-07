 require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const CustomerModel = require("./models/Customer");
const helmet = require("helmet");
const ExpressBrute = require("express-brute");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

mongoose.connect(
  "mongodb+srv://shamisokasekesk:9w6TI2eOXGHW4INd@cluster0.dopxwyl.mongodb.net/customer?retryWrites=true&w=majority&appName=Cluster0"
);

// Brute force protection
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// JWT Secret Key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

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

// Payment processing route (mock implementation)
app.post("/payment", (req, res) => {
  const { amount, accountNumber } = req.body;

  // Add payment processing logic here
  res.json({ message: `Payment of ${amount} to account ${accountNumber} processed successfully.` });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
