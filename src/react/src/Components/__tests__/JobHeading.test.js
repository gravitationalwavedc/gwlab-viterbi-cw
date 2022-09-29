import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { MockPayloadGenerator } from 'relay-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import 'regenerator-runtime/runtime';
import JobHeading from '../JobHeading';

/* global environment router */

describe('the data parameters form component', () => {
    const TestRenderer = () => (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query JobHeadingTestQuery($jobId: ID!) @relay_test_operation {
                viterbiJob (id: $jobId) {
                    id
                    userId
                    lastUpdated
                    start {
                        name
                        description
                        ...PrivacyToggle_data
                    }
                    jobStatus {
                      name
                      number
                      date
                    }
                    jobRunningTime
                }
                ...LabelDropdown_data @arguments(jobId: $jobId)
            }
          `}
            variables={{
                jobId: 'QmlsYnlKb2JOb2RlOjY='
            }}
            render={({ error, props }) => {
                if (props) {
                    return <JobHeading data={props} match={{params: {jobId: 'QmlsYnlKb'}}} router={router}/>;
                } else if (error) {
                    return error.message;
                }
                return 'Loading...';
            }}
        />
    );
    const mockViterbiJobHeadingReturn = (jobStatus='Error') => ({
        ViterbiJobNode() {
            return {
                id:'QmlsYnlKb2JOb2RlOjY=',
                userId:1,
                lastUpdated:'2020-10-05 04:47:02 UTC',
                start: {
                    name:'my-rad-job',
                    description:'a really cool description',
                    private:true
                },
                jobStatus: {
                    name:jobStatus,
                    number:'400',
                    date:'2020-10-05 04:49:58 UTC'
                },
                jobRunningTime: '1 day',
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
    });

    it('should render loading', async () => {
        expect.hasAssertions();
        render(<TestRenderer/>);
        expect(screen.queryByText('Loading...')).toBeInTheDocument();
    });
    
    it('should render', async () => {
        expect.hasAssertions();
        render(<TestRenderer/>);
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockViterbiJobHeadingReturn())
        ));
        expect(screen.queryByText('my-rad-job')).toBeInTheDocument();
        expect(screen.queryByText('a really cool description')).toBeInTheDocument();
    });
    
    it('check cancel job button visible when job is running', async () => {
        expect.hasAssertions();
        render(<TestRenderer/>);
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockViterbiJobHeadingReturn('Running'))
        ));
        expect(screen.queryByText('Cancel Job')).toBeInTheDocument();
        render(<TestRenderer/>);
        await waitFor(() => environment.mock.resolveMostRecentOperation(operation =>
            MockPayloadGenerator.generate(operation, mockViterbiJobHeadingReturn('Completed'))
        ));
        expect(screen.queryByText('Cancel Job')).not.toBeInTheDocument();
    });
});
