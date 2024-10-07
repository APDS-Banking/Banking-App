import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Signup from '../Signup'; 
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('axios');

beforeAll(() => {
  window.alert = jest.fn(); // Mock the alert function
});

describe('Signup Component', () => {
  test('renders signup form', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    screen.debug();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/id number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument(); 
  });

  test('submits registration successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Registration successful!' } });

    await act(async () => {
      render(
        <Router>
          <Signup />
        </Router>
      );

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '12345678' } });
      fireEvent.change(screen.getByLabelText(/id number/i), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/register', {
        name: 'John Doe',
        email: 'john@example.com',
        account: 12345678,
        id: 1234567890,
        password: 'password123',
      });
    });
  });

  test('handles existing user error', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'User already exists' } } });

    await act(async () => {
      render(
        <Router>
          <Signup />
        </Router>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(await screen.findByText(/user already exists/i)).toBeInTheDocument();
  });
});
