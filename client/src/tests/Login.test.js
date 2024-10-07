import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Login from '../Login'; 
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('axios');

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('submits form and logs in successfully', async () => {
    axios.post.mockResolvedValue({ data: { token: 'fake-token' } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/login', {
      email: 'user@test.com',
      password: 'password123',
    });
  });

  test('handles login failure', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Login failed' } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/login', {
      email: 'user@test.com',
      password: 'wrongpassword',
    });
  });
});
