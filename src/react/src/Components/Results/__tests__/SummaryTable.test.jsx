import React from 'react';
import { render, screen } from '@testing-library/react';
import { testViterbiSummaryTableData } from '../../../test_helper';
import SummaryTable from '../SummaryTable';


describe('summary table', () => {
    it('should render', () => {
        expect.hasAssertions();
        render(<SummaryTable data={testViterbiSummaryTableData} />);
        expect(screen.getByText('Most Significant Candidates')).toBeInTheDocument();
    });

    it('should render lines as not bold when logL is below logL threshold', () => {
        expect.hasAssertions();
        testViterbiSummaryTableData.logLThreshold = 100;
        render(<SummaryTable data={testViterbiSummaryTableData} />);
        const tableRows = screen.getAllByRole('row').slice(1);
        tableRows.forEach(
            e => expect(window.getComputedStyle(e).fontWeight).not.toBe('bold')
        );
    });

    it('should render lines as bold when logL is above logL threshold', () => {
        expect.hasAssertions();
        testViterbiSummaryTableData.logLThreshold = 1;
        render(<SummaryTable data={testViterbiSummaryTableData} />);
        const tableRows = screen.getAllByRole('row').slice(1);
        tableRows.forEach(
            e => expect(window.getComputedStyle(e).fontWeight).toBe('bold')
        );
    });
});