import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CheckButton from '../CheckButton';
import userEvent from '@testing-library/user-event';

/* global environment, router */

describe('the CheckButton component', () => {
    const mockYes = jest.fn();

    const renderButton = () => render(
        <CheckButton
            content="TestButtonText"
            cancelContent="TestOverlayText"
            onClick={mockYes}
        />
    );

    it('renders', () => {
        expect.hasAssertions();
        renderButton();
        expect(screen.queryByText('TestButtonText')).toBeInTheDocument();
        expect(screen.queryByText('TestOverlayText')).not.toBeInTheDocument();
    });
    
    it('renders overlay when clicked', async () => {
        expect.hasAssertions();
        renderButton();
        const button = screen.queryByText('TestButtonText');
        await waitFor(() => userEvent.click(button));
        expect(screen.queryByText('TestOverlayText')).toBeInTheDocument();
    });
    
    it('overlay closes on click no', async () => {
        expect.hasAssertions();
        renderButton();
        const button = screen.queryByText('TestButtonText');
        await waitFor(() => userEvent.click(button));
        expect(screen.queryByText('TestOverlayText')).toBeInTheDocument();
        const noButton = screen.queryByText('No');
        await waitFor(() => userEvent.click(noButton));
        expect(screen.queryByText('TestOverlayText')).not.toBeInTheDocument();
    });
    
    it('calls onClick on click yes', async () => {
        expect.hasAssertions();
        renderButton();
        const button = screen.queryByText('TestButtonText');
        await waitFor(() => userEvent.click(button));
        const yesButton = screen.queryByText('Yes');
        await waitFor(() => userEvent.click(yesButton));
        expect(mockYes).toHaveBeenCalledWith();
    });
});
