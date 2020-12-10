import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { MockPayloadGenerator } from 'relay-test-utils';
import { render, waitFor } from '@testing-library/react';
import ViewJob from '../ViewJob';

/* global environment, router */

describe('view job page', () => {
    const TestRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query ViewJobTestQuery($jobId: ID!) @relay_test_operation {
              ...ViewJob_data @arguments(jobId: $jobId)
            }
          `}
            variables={{
                jobId: 'QmlsYnlKb2JOb2RlOjY='
            }}
            render={({ error, props }) => {
                if (props) {
                    return <ViewJob data={props} match={{params: {jobId: 'QmlsYnlKb'}}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );

    const mockViterbiJobReturn = {
        ViterbiJobNode() {
            return {
                userId:1,
                lastUpdated:'2020-10-05 04:47:02 UTC',
                start: {
                    name:'my-rad-job',
                    description:'a really cool description',
                    private:true
                },
                jobStatus: {
                    name:'Error',
                    number:'400',
                    date:'2020-10-05 04:49:58 UTC'
                },
                data: {
                    startFrequencyBand: '188.0',
                    minStartTime: '1238166483',
                    maxStartTime: '1254582483',
                    asini: '0.01844',
                    freqBand: '1.2136296',
                    alpha: '4.974817413935078',
                    delta: '-0.4349442914295658',
                    orbitTp: '1238161512.786',
                    orbitPeriod: '4995.263',
                    driftTime: '864000',
                    dFreq: '5.78703704e-07',
                    id:'RGF0YVR5cGU6Ng=='
                },
                search: {
                    searchStartTime: '1238166483',
                    searchTBlock: '864000',
                    searchCentralA0: '0.01844',
                    searchA0Band: '0.00012',
                    searchA0Bins: '1',
                    searchCentralP: '4995.263',
                    searchPBand: '0.003',
                    searchPBins: '1',
                    searchCentralOrbitTp: '1238160263.9702501',
                    searchOrbitTpBand: '260.8101737969591',
                    searchOrbitTpBins: '9',
                    searchLLThreshold: '296.27423',
                    id: 'U2lnbmFsVHlwZTo2'
                },
                id:'QmlsYnlKb2JOb2RlOjY=',
                labels: [{
                    LabelType() { 
                        return {
                            name:'Review Requested',
                            id:'TGFiZWxUeXBlOjM='
                        };
                    }
                }]
            };
        },
        ViterbiResultFile() {
            return {
                path: 'a_cool_path',
                isDir: false,
                fileSize: 1234,
                downloadId: 'anDownloadId'
            };
        },
        ViterbiJobResultsFiles() {
            return {
                id: '123123',
                files: [
                    {ViterbiResultFile() {
                        return {
                            path: 'a_cool_path',
                            isDir: false,
                            fileSize: 1234,
                            downloadId: 'anDownloadId'
                        };
                    }}
                ]
            };
        }
    };

    it('should render a loading page', () => {
        expect.hasAssertions();
        const { getByText } = render(<TestRenderer />);
        expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the actual page', async () => {
        expect.hasAssertions();
        const { getByText, getAllByText } = render(<TestRenderer />);
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockViterbiJobReturn)
        ));   
        expect(getByText('my-rad-job')).toBeInTheDocument();
        expect(getAllByText('a_cool_path')[0]).toBeInTheDocument();
    });

});
