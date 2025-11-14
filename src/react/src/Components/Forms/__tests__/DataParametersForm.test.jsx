import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import DataParametersForm from '../DataParametersForm';
import { Formik } from 'formik';
import initialValues from '../initialValues';
import userEvent from '@testing-library/user-event';
import Input from '../Atoms/Input';

describe('the data parameters form component', () => {
    const mockPageChange = jest.fn();

    const formikWrapper = ({children}) => <Formik initialValues={initialValues}>
        {children}
    </Formik>;

    const renderTest = async () => await waitFor(() => render(
        <DataParametersForm handlePageChange={mockPageChange} />,
        {wrapper: formikWrapper}
    ));

    const renderTestWithInput = () => render(
        <>
            <Input name='driftTime' title='Drift Time' />
            <DataParametersForm handlePageChange={mockPageChange} />;
        </>,
        {wrapper: formikWrapper}
    );

    it('should render', async () => {
        expect.hasAssertions();
        await renderTest();
        expect(screen.queryByText('Select target position')).toBeInTheDocument();
        expect(screen.queryByText('Select frequency settings')).toBeInTheDocument();
    });
    
    it('should maintain choice of custom alpha and delta when switching to popular target and back', async () => {
        expect.hasAssertions();
        await renderTest();

        const popularTargetsSelect = screen.queryByLabelText('Popular Targets');
        const alphaInput = screen.queryByLabelText('Right ascension');
        const deltaInput = screen.queryByLabelText('Declination');

        // Check initial values are as expected
        expect(alphaInput.value).toBe(initialValues.alpha.toString());
        expect(deltaInput.value).toBe(initialValues.delta.toString());

        // Change values in inputs
        const customAlpha = '1234';
        const customDelta = '5678';
        await waitFor(() => userEvent.clear(alphaInput));
        await waitFor(() => userEvent.type(alphaInput, customAlpha));
        await waitFor(() => userEvent.clear(deltaInput));
        await waitFor(() => userEvent.type(deltaInput, customDelta));

        // Then change the select option to overwrite the alpha and delta with target
        await waitFor(() => userEvent.selectOptions(popularTargetsSelect, 'Scorpius X-1'));
        expect(alphaInput.value).toBe('4.27569923849971');
        expect(deltaInput.value).toBe('-0.250624917263256');

        // Change the select option back to custom to overwrite the alpha and delta with original custom valuse
        await waitFor(() => userEvent.selectOptions(popularTargetsSelect, 'Custom'));
        expect(alphaInput.value).not.toBe('4.27569923849971');
        expect(deltaInput.value).not.toBe('-0.250624917263256');
        expect(alphaInput.value).not.toBe(initialValues.alpha.toString());
        expect(deltaInput.value).not.toBe(initialValues.delta.toString());
        expect(alphaInput.value).toBe(customAlpha);
        expect(deltaInput.value).toBe(customDelta);
    });
    
    it('should update bandwidth options based on frequency band', async () => {
        expect.hasAssertions();
        renderTestWithInput();
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
        await renderTest();
        await waitFor(() => userEvent.click(screen.queryByRole('button', {name: 'Data Settings'})));
        expect(mockPageChange).toHaveBeenCalledWith('data');
    });

    it('should allow forwards page change', async () => {
        expect.hasAssertions();
        await renderTest();
        await waitFor(() => userEvent.click(screen.queryByRole('button', {name: 'Parameters'})));
        expect(mockPageChange).toHaveBeenCalledWith('searchParameters');
    });
});
