const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true }, // Customer's name
    customerAccountNumber: { type: String, required: true }, // Customer's account number
    recipientName: { type: String, required: true },
    recipientBank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    swiftCode: { type: String, required: true },
    status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
