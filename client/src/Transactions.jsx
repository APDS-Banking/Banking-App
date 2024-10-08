import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]); // State for transactions
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                navigate('/login'); // Redirect to login if no token
                return;
            }
            

            try {
                const response = await axios.get('http://localhost:3001/transactions', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTransactions(response.data); // Store transactions in state
            } catch (error) {
                console.error("Error fetching transactions:", error);
                navigate('/login'); // Redirect to login on error
            }
        };

        fetchTransactions();
    }, [navigate]);

    const handleBack = () => {
        // Go back to the home page
        navigate('/home');
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-75 text-center">
                <h2>Your Transactions</h2>
                <button 
                    className="btn btn-primary mb-3"
                    onClick={handleBack}
                >
                    Back to Home
                </button>
                <ul className="list-group">
                    {transactions.length === 0 ? (
                        <li className="list-group-item">No transactions found.</li>
                    ) : (
                        transactions.map((transaction) => (
                            <li className="list-group-item" key={transaction._id}>
                                <strong>Recipient:</strong> {transaction.recipientName} <br />
                                <strong>Amount:</strong> R{transaction.amount} <br />
                                <strong>Bank:</strong> {transaction.recipientBank} <br />
                                <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()} <br />
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Transactions;
