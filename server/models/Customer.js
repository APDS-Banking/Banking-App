const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    account: { type: Number, required: true },   
    id: { type: Number, required: true },  
    password: { type: String, required: true },
    balance: { type: Number, default: 50000 } 
});

const CustomerModel = mongoose.model("customers", CustomerSchema);
module.exports = CustomerModel;
