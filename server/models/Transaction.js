// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    recipientName: {
        type: String,
        required: true,
    },
    recipientBank: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1, // Ensure a minimum amount
    },
    swiftCode: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = TransactionModel;
