import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Payment from '../Payment';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('axios');

describe('Payment Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders payment form', () => {
    render(
      <Router>
        <Payment />
      </Router>
    );

    expect(screen.getByLabelText(/recipient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient bank/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/swift code/i)).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Payment successful' } });

    render(
      <Router>
        <Payment />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/recipient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/recipient bank/i), { target: { value: 'Bank XYZ' } });
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/swift code/i), { target: { value: 'XYZ123' } });

    fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/payment', {
      recipientName: 'John Doe',
      recipientBank: 'Bank XYZ',
      accountNumber: '123456789',
      amount: '1000',
      swiftCode: 'XYZ123',
    }, {
      headers: { Authorization: 'Bearer fake-token' },
    });
  });

  test('handles payment failure', async () => {
    axios.post.mockRejectedValue(new Error('Payment failed'));

    render(
      <Router>
        <Payment />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/recipient name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/recipient bank/i), { target: { value: 'Bank XYZ' } });
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/swift code/i), { target: { value: 'XYZ123' } });

    fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

    // Here you can check for an alert or any other UI indication of failure
  });

  test('redirects to login if no token', () => {
    localStorage.removeItem('token');

    render(
      <Router>
        <Payment />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

    // Here you would check that the user is redirected to the login page
  });
});