import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [customerName, setCustomerName] = useState('');
    const [balance, setBalance] = useState(50000); 
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch customer details after login
        const fetchCustomerData = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                navigate('/login'); // Redirect to login if no token
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/customer', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCustomerName(response.data.name); 
            } catch (error) {
                console.error("Error fetching customer data:", error);
                navigate('/login'); // Redirect to login on error
            }
        };

        

        fetchCustomerData();
    }, [navigate]);

    const handlePayment = () => {
        // Redirect to payment page
        navigate('/payment');
    };

    const handleViewTransactions = () => {
        // Redirect to transactions page
        navigate('/transactions');
    };
    
    const handleLogout = () => {
        // Clear token and navigate to login page
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-4 rounded w-25 text-center">
                <h1>Hello, {customerName}!</h1>
                <p>Your account balance: R {balance}</p>
                <button 
                    className="btn btn-success w-100 rounded-0"
                    onClick={handlePayment}
                >
                    Make International Payment
                </button>
                <button 
                    className="btn btn-info w-100 rounded-0 mt-2"
                    onClick={handleViewTransactions}
                >
                    View Transactions
                </button>
                <button 
                    className="btn btn-danger w-100 rounded-0 mt-2"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Home;
