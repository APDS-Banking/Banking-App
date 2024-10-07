import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Transactions from '../Transactions';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Transactions Component', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'mockToken'); // Mock a token in localStorage
    });

    it('should render the transaction list if transactions are available', async () => {
        // Mock API response
        axios.get.mockResolvedValue({
            data: [
                {
                    _id: '1',
                    recipientName: 'John Doe',
                    amount: 100,
                    recipientBank: 'Bank A',
                    createdAt: '2024-10-01T00:00:00Z'
                }
            ]
        });

        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Check that the transaction details are rendered
        expect(await screen.findByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/R100/)).toBeInTheDocument();
        expect(screen.getByText(/Bank A/)).toBeInTheDocument();
    });

    it('should display "No transactions found." if there are no transactions', async () => {
        // Mock API response
        axios.get.mockResolvedValue({ data: [] });

        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Transactions />} />
                </Routes>
            </MemoryRouter>
        );

        // Check that the no transactions message is displayed
        expect(await screen.findByText(/No transactions found/)).toBeInTheDocument();
    });

    it('should navigate to /login if no token is found', () => {
        localStorage.removeItem('token'); // Remove token from localStorage

        const mockNavigate = jest.fn();
        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Transactions navigate={mockNavigate} />} />
                </Routes>
            </MemoryRouter>
        );

        // Check if navigate to /login is called
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate back to /home when the back button is clicked', () => {
        const mockNavigate = jest.fn();

        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Transactions navigate={mockNavigate} />} />
                </Routes>
            </MemoryRouter>
        );

        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        // Check if navigate to /home is called
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
});
