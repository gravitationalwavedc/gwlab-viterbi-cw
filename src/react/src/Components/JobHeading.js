import React, { useState } from 'react';
import Link from 'found/Link';
import { commitMutation, createRefetchContainer, graphql } from 'react-relay';
import { harnessApi } from '../index';
import { Row, Col, Button, Container, Toast } from 'react-bootstrap';
import PrivacyToggle from '../Components/Results/PrivacyToggle';
import moment from 'moment';
import OzstarLogo from '../assets/ostar_svg.svg';
import CheckButton from './CheckButton';

const JobHeading = ({jobData, match, router, relay}) => {
    const [saved, setSaved] = useState(false); 
    const [showNotification, setShowNotification] = useState(false);

    const onSave = (saved) => {
        setSaved(saved);
        setShowNotification(true);
    };

    const { start, lastUpdated, userId } = jobData;
    const updated = moment.utc(lastUpdated, 'YYYY-MM-DD HH:mm:ss UTC').local().format('llll');
    const jobStatus = jobData.jobStatus.name.toLowerCase();
    const cancelStatuses = [40, 50]; // These correspond to Queued and Running statuses

    const cancelJob = () => {
        commitMutation(harnessApi.getEnvironment('viterbi'), {
            mutation: graphql`mutation JobHeadingCancelJobMutation($jobId: ID!){
                cancelViterbiJob(input: {jobId: $jobId}) {
                    result
                }
            }`,
            variables: {
                jobId: jobData.id,
            },
            onCompleted: (response, errors) => {
                // TODO: Handle the errors better
                if (!errors) {
                    relay.refetch(
                        {jobId: jobData.id},
                    );
                }
            },
        });
    };


    return (
        <Container className="pt-5">
            {showNotification && 
              <Toast 
                  style={{position: 'absolute', top: '56px', right:'50px'}} 
                  onClose={() => setShowNotification(false)} 
                  show={showNotification} 
                  delay={3000} 
                  autohide>
                  <Toast.Header>Saved</Toast.Header>
                  <Toast.Body>Updated job labels.</Toast.Body>
              </Toast>
            }
            <Row>
                <Col md={3} xl={2} className="text-right">
                    <OzstarLogo className="review-logo" />
                </Col>
                <Col md={9} xl={10} xs={12}>
                    <h1 className="mb-0">
                        {start.name} 
                    </h1>
                    <h5 className="mb-0">{start.description}</h5>
                    <p className="mb-0">
                        Created: {updated}
                    </p>
                    {
                        jobData.jobRunningTime && <p className="mb-0">
                            Running time: {jobData.jobRunningTime}
                        </p>
                    }
                    <p className={`status-${jobStatus} review-heading`}>
                        {jobStatus}
                    </p>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={{span: 9, offset: 3}} xl={{span: 10, offset: 2}} xs={12}>
                    <Link as={Button} to={{
                        pathname: '/viterbi/job-form/duplicate/',
                        state: {
                            jobId: match.params.jobId
                        }
                    }} activeClassName="selected" exact match={match} router={router}>
                      Duplicate job
                    </Link>
                    {
                        cancelStatuses.includes(jobData.jobStatus.number) && <CheckButton
                            buttonContent="Cancel Job"
                            modalTitle="Are you sure you want to permanently stop this job?"
                            modalContent={<div>
                                When a job is cancelled, it can&apos;t be started again!<br/>
                                You will have to create a completely new job with the same parameters.
                            </div>}
                            yesContent="Stop Job"
                            noContent="Keep Job"
                            onClick={cancelJob}
                            variant="danger"
                            className="ml-2"
                        />
                    }
                    <PrivacyToggle 
                        userId={userId} 
                        jobId={match.params.jobId} 
                        data={start} 
                        onUpdate={onSave} />
                </Col>
            </Row>
        </Container>);
};

// export default JobHeading;
export default createRefetchContainer(JobHeading,
    {
        jobData: graphql`
            fragment JobHeading_jobData on ViterbiJobNode {
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
        `,
    },
    graphql`
        query JobHeadingRefetchQuery($jobId: ID!){
            viterbiJob (id: $jobId){
                ...JobHeading_jobData
            }
        }
    `
);
