import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { QueryRenderer, graphql } from 'react-relay';
import { render } from '@testing-library/react';
import DuplicateJobForm from '../Forms/DuplicateJobForm';
import 'regenerator-runtime/runtime';

/* global environment, router */

describe('duplicate a job and create a new form', () => {

    const TestRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query DuplicateJobFormTestQuery ($jobId: ID!)
              @relay_test_operation {
                ...DuplicateJobForm_data @arguments(jobId: $jobId)
            }
          `}
            variables={{
                jobId: '1234' 
            }}
            render={({ error, props }) => {
                if (props) {
                    return <DuplicateJobForm data={props} match={{}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    const mockReturn = {
        ViterbiJobNode() {
            return {
                start: {
                    name: 'TestJob-1',
                    description: 'A test job.',
                    private: true,
                },
                data: {
                    dataChoice: 'real',
                    sourceDataset: 'o3',
                    startFrequencyBand: 188.0,
                    minStartTime: 1238166483,
                    maxStartTime: 1254582483,
                    asini: 0.01844,
                    freqBand: 1.2136296296296296,
                    alpha: 4.974817413935078,
                    delta: -0.4349442914295658,
                    orbitTp: 1238161512.786,
                    orbitPeriod: 4995.263,
                    driftTime: 864000,
                    dFreq: 5.78703704e-07
                },
                search: {
                    searchStartTime: 1238166483,
                    searchTBlock: 864000,
                    searchCentralA0: 0.01844,
                    searchA0Band: 0.00012,
                    searchA0Bins: 1,
                    searchCentralP: 4995.263,
                    searchPBand: 0.003,
                    searchPBins: 1,
                    searchCentralOrbitTp: 1238160263.9702501,
                    searchOrbitTpBand: 260.8101737969591,
                    searchOrbitTpBins: 9,
                    searchLLThreshold: 296.27423
                }
            };
        }
    };

    it('renders with copy of returned data', () => {
        expect.hasAssertions();
        const { getByText } = render(<TestRenderer />);
        environment.mock.resolveMostRecentOperation(operation => 
            MockPayloadGenerator.generate(operation, mockReturn)
        );
        expect(getByText('Copy-of-TestJob-1')).toBeInTheDocument();
        expect(
            getByText('A duplicate job of Copy-of-TestJob-1. Original description: A test job.')
        ).toBeInTheDocument();
    });
});
