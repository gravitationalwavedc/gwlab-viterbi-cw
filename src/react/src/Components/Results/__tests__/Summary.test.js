import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { MockPayloadGenerator } from 'relay-test-utils';
import { render, screen } from '@testing-library/react';
import { 
    testViterbiSummaryTableData,
    testViterbiSummaryPlotData,
    mockResizeObserver,
    restoreResizeObserver
} from '../../../test_helper';
import Summary from '../Summary';

import 'regenerator-runtime/runtime';

/* global environment, router */

describe('view job page', () => {
    const SummaryRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
                query SummaryTestQuery ($jobId: ID!) @relay_test_operation {
                    ...Summary_data @arguments(jobId: $jobId)
                }
            `}
            variables={{
                jobId: 'QmlsYnlKb2JOb2RlOjY='
            }}
            render={({ error, props }) => {
                if (props) {
                    return <Summary data={props} match={{}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    it('should render message if no summary data', () => {
        expect.hasAssertions();
        render(<SummaryRenderer />);
        environment.mock.resolveMostRecentOperation(operation => 
            MockPayloadGenerator.generate(operation, {
                Query() {
                    return {'viterbiSummaryResults': null};
                }}
            )
        );
        expect(screen.queryByText('Most Significant Candidates')).not.toBeInTheDocument();
        expect(screen.queryByText('Viterbi Path of Best Candidate')).not.toBeInTheDocument();
        expect(screen.getByText('No summary data is available')).toBeInTheDocument();
    });

    it('should render the summary page with correct query data', () => {
        expect.hasAssertions();
        mockResizeObserver();
        render(<SummaryRenderer />);
        environment.mock.resolveMostRecentOperation(operation => 
            MockPayloadGenerator.generate(operation, {
                ViterbiSummaryResultsType() {
                    return {
                        tableData: JSON.stringify(testViterbiSummaryTableData),
                        plotData: JSON.stringify(testViterbiSummaryPlotData)
                    };
                }}
            )
        );
        expect(screen.getByText('Most Significant Candidates')).toBeInTheDocument();
        expect(screen.getByText('Viterbi Path of Best Candidate')).toBeInTheDocument();
        restoreResizeObserver();
    });
});