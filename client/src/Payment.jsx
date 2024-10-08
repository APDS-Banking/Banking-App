import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [recipientName, setRecipientName] = useState('');
    const [recipientBank, setRecipientBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const navigate = useNavigate();

    const nameRegex = /^[A-Za-z\s]+$/; 
    const bankRegex = /^[A-Za-z0-9\s]+$/; 
    const accountRegex = /^\d{8,12}$/; 
    const amountRegex = /^[1-9]\d*(\.\d{1,2})?$/; 
    const swiftRegex = /^[A-Za-z0-9]{8,11}$/; 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nameRegex.test(recipientName)) {
            alert("Invalid recipient name. Only letters and spaces are allowed.");
            return;
        }

        if (!bankRegex.test(recipientBank)) {
            alert("Invalid recipient bank. Only letters, numbers, and spaces are allowed.");
            return;
        }

        if (!accountRegex.test(accountNumber)) {
            alert("Invalid account number. It should be 8-12 digits.");
            return;
        }

        if (!amountRegex.test(amount)) {
            alert("Invalid amount. Enter a positive number with up to 2 decimal places.");
            return;
        }

        if (!swiftRegex.test(swiftCode)) {
            alert("Invalid SWIFT code. It should be 8 to 11 alphanumeric characters.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); 
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/payment', {
                recipientName,
                recipientBank,
                accountNumber,
                amount,
                swiftCode,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(response.data.message); 
            navigate('/home'); 
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Failed to process payment. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/home'); 
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-25">
                <h2>Make Payment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="recipientName" className="form-label">
                            <strong>Recipient Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter recipient name"
                            className="form-control rounded-0"
                            onChange={(e) => setRecipientName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="recipientBank" className="form-label">
                            <strong>Recipient Bank</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter recipient bank"
                            className="form-control rounded-0"
                            onChange={(e) => setRecipientBank(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="accountNumber" className="form-label">
                            <strong>Account Number</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter account number"
                            className="form-control rounded-0"
                            onChange={(e) => setAccountNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                            <strong>Amount (R)</strong>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="form-control rounded-0"
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="swiftCode" className="form-label">
                            <strong>SWIFT Code</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter SWIFT code"
                            className="form-control rounded-0"
                            onChange={(e) => setSwiftCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Submit Payment
                    </button>
                    <button type="button" className="btn btn-danger w-100 rounded-0 mt-2" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
