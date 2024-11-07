import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

    // Example API call to authenticate employee
    axios.post('https://localhost:3001/employee/login', { email, password })
      .then(result => {
        if (result.data.token) {
          // Store JWT token in localStorage
          localStorage.setItem("employeeToken", result.data.token);

          // Redirect to employee dashboard or secure page
          navigate('/employee/dashboard');
        } else {
          setErrorMessage(result.data.message || "Incorrect email or password.");
        }
      })
      .catch(err => {
        console.error("Error during employee login:", err);
        setErrorMessage("Failed to login. Please check your credentials and try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Employee Login</h2>
        <form onSubmit={handleEmployeeSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              autoComplete="off"
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

          <button type="submit" className="btn btn-primary w-100 rounded-0">Login</button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
