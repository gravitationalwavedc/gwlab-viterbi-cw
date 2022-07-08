import React from 'react';
import { render, screen } from '@testing-library/react';
import { testViterbiSummaryPlotData, mockResizeObserver, restoreResizeObserver } from '../../../test_helper';
import SummaryPlot from '../SummaryPlot';


describe('summary plot', () => {
    it('should render', () => {
        expect.hasAssertions();
        mockResizeObserver();
        render(<SummaryPlot data={testViterbiSummaryPlotData} />);
        expect(screen.getByText('Viterbi Path of Best Candidate')).toBeInTheDocument();
        restoreResizeObserver();
    });
});