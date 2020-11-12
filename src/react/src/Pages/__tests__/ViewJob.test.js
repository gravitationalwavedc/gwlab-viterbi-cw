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
                    dataChoice: 'simulated',
                    sourceDataset: 'o1',
                    startTime: '1126259462.391',
                    duration: '10m',
                    h0: '8e-26',
                    a0: '1.45',
                    orbitTp: '2.56',
                    signalFrequency: '150',
                    psi: '0',
                    cosi: '1',
                    alpha: '2',
                    delta: '3',
                    orbitPeriod: '68023.84',
                    randSeed: '50',
                    ifo: '["hanford"]',
                    noiseLevel: '4e-24',
                    id:'RGF0YVR5cGU6Ng=='
                },
                search: {
                    frequency: '10.54',
                    band: '10.54',
                    a0Start: '10.54',
                    a0End: '10.54',
                    a0Bins: '500',
                    orbitTpStart: '10.54',
                    orbitTpEnd: '10.54',
                    orbitTpBins: '500',
                    alphaSearch: '7.54',
                    deltaSearch: '7.54',
                    orbitPeriodSearch: '10.54',
                    id:'U2lnbmFsVHlwZTo2'
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
