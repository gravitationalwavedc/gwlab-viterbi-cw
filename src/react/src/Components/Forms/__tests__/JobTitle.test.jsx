import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import JobTitle from '../JobTitle';
import { Formik } from 'formik';
import initialValues from '../initialValues';
import userEvent from '@testing-library/user-event';

/* global global */

describe('the job title component', () => {
    const formikWrapper = ({children}) => <Formik initialValues={initialValues}>
        {
            ({setFieldError}) => {
                global.setFieldError = setFieldError;
                return children;
            }
        }
    </Formik>;

    const renderTest = async () => await waitFor(() => render(
        <JobTitle />,
        {wrapper: formikWrapper}
    ));

    it('should render', async () => {
        expect.hasAssertions();
        await renderTest();
        expect(screen.queryByText(initialValues.name)).toBeInTheDocument();
        expect(screen.queryByText(initialValues.description)).toBeInTheDocument();
    });

    it('should render error on blur', async () => {
        expect.hasAssertions();
        await renderTest();
        const user = userEvent.setup();
        const testNameError = 'Test name error';
        expect(screen.queryByText(testNameError)).not.toBeInTheDocument();
        await waitFor(() => user.click(screen.queryByText(initialValues.name)));
        await waitFor(() => user.click(screen.queryByTestId('saveButton')));
        
        // Have to hack things and do it in this order because otherwise the test error is overwritten
        await waitFor(() => global.setFieldError('name', testNameError));
        expect(screen.queryByText(testNameError)).toBeInTheDocument();

    });
});
