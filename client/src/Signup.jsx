import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [id, setID] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accountNumber = parseInt(account);
        const idNumber = parseInt(id);

        try {
            const result = await axios.post('http://localhost:3001/register', {
                name,
                email,
                account: accountNumber,
                id: idNumber,
                password
            });
            console.log(result);
            alert("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            // Check if the error indicates that the user already exists
            if (err.response && err.response.data && err.response.data.message === "User already exists") {
                alert("User already exists. Please use a different email or account number.");
            } else {
                alert("User already exists. Please use a different email or account number.");
            }
        }
    };
        
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="account">
                            <strong>Account Number</strong>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter account number"
                            autoComplete="off"
                            name="account"
                            className="form-control rounded-0"
                            onChange={(e) => setAccount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="id">
                            <strong>ID Number</strong>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter ID number"
                            autoComplete="off"
                            name="id"
                            className="form-control rounded-0"
                            onChange={(e) => setID(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;
