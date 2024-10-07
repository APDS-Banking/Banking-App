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
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
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

            alert(response.data.message); // Notify user of success or failure
            navigate('/home'); // Redirect back to home page after successful payment
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Failed to process payment. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/home'); // Redirect to home on cancel
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
