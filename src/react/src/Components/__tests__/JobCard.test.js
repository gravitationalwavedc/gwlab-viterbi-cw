/* eslint-disable jest/no-hooks */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import JobCard from '../JobCard';
import userEvent from '@testing-library/user-event';

/* global router, match */

describe('job card component', () => {
    const job = {
        id: '<test-job-id>',
        name: 'TestJob',
        description: 'Test job',
        user: 'Bill Nye',
        jobStatus: {
            name: 'COMPLETED'
        }

    };
    const renderCard = () => render(
        <JobCard
            node={job}
            router={router}
            match={match}
        />
    );

    afterEach(() => jest.clearAllMocks());

    it('renders', () => {
        expect.hasAssertions();
        renderCard();
        expect(screen.queryByText(job.name)).toBeInTheDocument();
        expect(screen.queryByText(job.description)).toBeInTheDocument();
    });

    it('is clickable', async () => {
        expect.hasAssertions();
        renderCard();
        const user = userEvent.setup();
        const card = screen.queryByText(job.name).parentElement;
        await waitFor(() => user.click(card));
        expect(router.push).toHaveBeenCalledWith({'pathname': '/viterbi/job-results/<test-job-id>/'});
    });

    it('has duplicate link', async () => {
        expect.hasAssertions();
        renderCard();
        const user = userEvent.setup();
        const duplicateButton = screen.queryByText('Duplicate');
        expect(duplicateButton).toBeInTheDocument();
        
        await waitFor(() => user.click(duplicateButton));
        expect(router.push).toHaveBeenCalledWith({
            'pathname': '/viterbi/job-form/duplicate/',
            'state': {
                'jobId': '<test-job-id>',
            },
        });
    });
});
