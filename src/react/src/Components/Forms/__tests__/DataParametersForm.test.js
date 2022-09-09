import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import DataParametersForm from '../DataParametersForm';
import { useFormik } from 'formik';
import initialValues from '../initialValues';
import userEvent from '@testing-library/user-event';
import Input from '../Atoms/Input';

describe('the data parameters form component', () => {
    const mockPageChange = jest.fn();

    const TestRenderer = () => {
        const formik = useFormik({
            initialValues: initialValues,
        });
        return <DataParametersForm formik={formik} handlePageChange={mockPageChange} />;
    };

    const TestRendererWithInput = () => {
        const formik = useFormik({
            initialValues: initialValues,
        });
        return <>
            <Input formik={formik} name='driftTime' title='Drift Time' />
            <DataParametersForm formik={formik} handlePageChange={mockPageChange} />;
        </>;
    };
    
    it('should render', async () => {
        expect.hasAssertions();
        await waitFor(() => render(<TestRenderer/>));
        expect(screen.queryByText('Select target position')).toBeInTheDocument();
        expect(screen.queryByText('Select frequency settings')).toBeInTheDocument();
    });
    
    it('should update bandwidth options based on frequency band', async () => {
        expect.hasAssertions();
        await waitFor(() => render(<TestRendererWithInput/>));
        const driftTimeInput = screen.queryByLabelText('Drift Time');
        const bandwidthSelect = screen.queryByLabelText('Band width');

        const options = within(bandwidthSelect).getAllByRole('option');

        await waitFor(() => userEvent.clear(driftTimeInput));
        await waitFor(() => userEvent.type(driftTimeInput, '4000'));

        const newOptions = within(bandwidthSelect).getAllByRole('option');
        const expectedNewOptions = [
            {value: '0.128', label: '0.12800000'},
            {value: '0.256', label: '0.25600000'},
            {value: '0.512', label: '0.51200000'},
            {value: '1.024', label: '1.02400000'}
        ];
        newOptions.forEach((newOption, index) => {
            expect(newOption.value).not.toBe(options[index].value);
            expect(newOption.label).not.toBe(options[index].label);

            expect(newOption.value).toBe(expectedNewOptions[index].value);
            expect(newOption.label).toBe(expectedNewOptions[index].label);
        });
        
    });
    
    it('should allow backwards page change', async () => {
        expect.hasAssertions();
        await waitFor(() => render(<TestRenderer/>));
        await waitFor(() => userEvent.click(screen.queryByRole('button', {name: 'Data Settings'})));
        expect(mockPageChange).toHaveBeenCalledWith('data');
    });

    it('should allow forwards page change', async () => {
        expect.hasAssertions();
        await waitFor(() => render(<TestRenderer/>));
        await waitFor(() => userEvent.click(screen.queryByRole('button', {name: 'Parameters'})));
        expect(mockPageChange).toHaveBeenCalledWith('searchParameters');
    });
});
