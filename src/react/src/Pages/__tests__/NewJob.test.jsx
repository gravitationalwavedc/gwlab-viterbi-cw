import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import NewJob from '../NewJob';
import 'regenerator-runtime/runtime';
import userEvent from '@testing-library/user-event';
import initialValues from '../../Components/Forms/initialValues';

/* global router, environment */

describe('new Job Page', () => {

    it('should fail if name and description remain unmodified', async () => {
        expect.hasAssertions();
        const user = userEvent.setup();
        render(<NewJob router={router} />);
        await user.click(screen.getAllByText('Submit')[0]);

        expect(router.replace).not.toHaveBeenCalledWith('/viterbi/job-results/<mock-value-for-field-"jobId">/');
    });

    it('should send a mutation when the form is submitted', async () => {
        expect.hasAssertions();
        const user = userEvent.setup();
        render(<NewJob router={router} />);

        // Require name and description to be different from the initial values
        await user.type(screen.getByText(initialValues.name), 'Changed');
        await user.type(screen.getByText(initialValues.description), 'Changed');
        await user.click(screen.getAllByText('Submit')[0]);
        const operation = await waitFor(() => environment.mock.getMostRecentOperation());
        environment.mock.resolve(
            operation,
            MockPayloadGenerator.generate(operation)
        );
        expect(router.replace).toHaveBeenCalledWith('/viterbi/job-results/<mock-value-for-field-"jobId">/');
    });

    it('should navigate between tabs', async () => {
        expect.hasAssertions();
        const user = userEvent.setup();
        render(<NewJob />);
        const dataParametersPane = screen.getByTestId('dataParametersPane');
        expect(dataParametersPane).toHaveAttribute('aria-hidden', 'true');
        const signalNavButton = screen.getAllByText('F Statistic')[1];
        await waitFor(() => user.click(signalNavButton));
        expect(dataParametersPane).toHaveAttribute('aria-hidden', 'false');
    });
});

