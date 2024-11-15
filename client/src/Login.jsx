import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to get the CSRF token

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For storing error messages
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Get the CSRF token from the cookie
    const csrfToken = Cookies.get('XSRF-TOKEN'); 

    axios.post('http://localhost:3001/login', { email, password }, {
      headers: {
        'X-XSRF-TOKEN': csrfToken 
      }
    })
      .then(result => {
        if (result.data.token) {
          // Store JWT token in localStorage
          localStorage.setItem("token", result.data.token);

          // Navigate to home page
          navigate('/home');
        } else {
          // Show error message if login failed
          setErrorMessage(result.data.message || "Incorrect email or password.");
        }
      })
      .catch(err => {
        console.error("Error during login:", err);
        setErrorMessage("Failed to login. Please check your credentials and try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              id="email"  
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              id="password"  
              placeholder="Enter password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 rounded-0">Login</button>
        </form>

        <p className="mt-3">Employee?</p>
        <Link to="/EmployeeLogin" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Employee Login
        </Link>
      </div>
    </div>
  );
}

export default Login;
