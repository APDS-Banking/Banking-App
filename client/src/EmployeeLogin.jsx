import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Hardcoded employee credentials
  const hardcodedEmployee = {
    email: 'test@employee.com',
    password: 'Pass123!' 
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

     // Check credentials against hardcoded values
     if (email === hardcodedEmployee.email && password === hardcodedEmployee.password) {
        // Simulate token storage or session setup
        localStorage.setItem('employeeToken', 'fake-jwt-token'); // Replace with a real token in production
  
        // Navigate to the employee dashboard
        navigate('/EmployeeDashboard');
      } else {
        setErrorMessage("Incorrect email or password.");
      }
    };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Employee Login</h2>
        <form onSubmit={handleEmployeeSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
