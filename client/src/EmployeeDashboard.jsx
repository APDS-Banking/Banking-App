import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css'; // Import the CSS file for styling

function EmployeeDashboard() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/employee/transactions', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                navigate('/login');
            }
        };

        fetchTransactions();
    }, [navigate]);

    const updateTransactionStatus = async (transactionId, newStatus) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.put(
                `http://localhost:3001/transactions/${transactionId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Transaction ${newStatus}!`);
            setTransactions(transactions.map(tx =>
                tx._id === transactionId ? { ...tx, status: newStatus } : tx
            ));
        } catch (error) {
            console.error(`Error updating transaction status to ${newStatus}:`, error);
            alert(`Failed to ${newStatus.toLowerCase()} transaction`);
        }
    };

    const handleSubmitToSwift = async (transactionId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(
                `http://localhost:3001/transactions/${transactionId}/submit-swift`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Transaction submitted to SWIFT!');
            setTransactions(transactions.map(tx =>
                tx._id === transactionId ? { ...tx, status: 'Submitted to SWIFT' } : tx
            ));
        } catch (error) {
            console.error('Error submitting transaction to SWIFT:', error);
            alert('Failed to submit transaction to SWIFT');
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Employee Dashboard</h2>
            <div className="transactions-list">
                {transactions.length === 0 ? (
                    <p>No pending transactions available.</p>
                ) : (
                    transactions.map(transaction => (
                        <div className="transaction-card" key={transaction._id}>
                            <h3 className="transaction-recipient">Recipient: {transaction.recipientName}</h3>
                            <p><strong>Amount:</strong> R{transaction.amount}</p>
                            <p><strong>Bank:</strong> {transaction.recipientBank}</p>
                            <p><strong>Recipient Account Number:</strong> {transaction.accountNumber}</p>
                            <p><strong>SWIFT Code:</strong> {transaction.swiftCode}</p>
                            
                            {/* Customer Information */}
                            <h4>Customer Information</h4>
                            <p><strong>Customer Name:</strong> {transaction.customerName}</p>
                            <p><strong>Customer Account Number:</strong> {transaction.customerAccountNumber}</p>

                            <p><strong>Status:</strong> {transaction.status}</p>
                            <div className="transaction-actions">
                                {transaction.status === 'Pending' && (
                                    <>
                                        <button className="approve-button" onClick={() => updateTransactionStatus(transaction._id, 'Approved')}>Approve</button>
                                        <button className="reject-button" onClick={() => updateTransactionStatus(transaction._id, 'Rejected')}>Reject</button>
                                    </>
                                )}
                                {transaction.status === 'Approved' && (
                                    <button className="swift-button" onClick={() => handleSubmitToSwift(transaction._id)}>Submit to SWIFT</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EmployeeDashboard;
