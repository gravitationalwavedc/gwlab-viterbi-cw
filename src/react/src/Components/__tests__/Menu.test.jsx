import React from 'react';
import { render, screen } from '@testing-library/react';
import Menu from '../Menu';

/* global TestRouter */

describe('secondary menu component', () => {
    it('renders', () => {
        expect.hasAssertions();
        render(<Menu/>, {wrapper: TestRouter});
        expect(screen.queryByText('Jobs')).toBeInTheDocument();
        expect(screen.queryByText('New Job')).toBeInTheDocument();
    });
});
