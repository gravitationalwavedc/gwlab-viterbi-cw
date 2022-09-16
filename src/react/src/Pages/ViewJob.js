import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Row, Nav, Col, Container, Tab, } from 'react-bootstrap';
import Files from '../Components/Results/Files';
import Parameters from '../Components/Results/Parameters';
import JobHeading from '../Components/JobHeading';
import Error404 from '../Error404';
import Summary from '../Components/Results/Summary';

const ViewJob = ({ data, match, router, ...rest}) => (
    <>
        {data.viterbiJob ? <><JobHeading data={data} match={match} router={router} />
            <Container className="form-container pb-5 pt-5" fluid>
                <Container>
                    <Tab.Container id="jobResultsTabs" defaultActiveKey="parameters">
                        <Row>
                            <Col md={3} xl={2}>
                                <Nav className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="parameters">
                                            <p className="text-button">Parameters</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="summary">
                                            <p className="text-button">Summary</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="results">
                                            <p className="text-button">Results</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col>
                                <Tab.Content>
                                    <Tab.Pane eventKey="parameters">
                                        <Parameters jobData={data.viterbiJob} {...rest}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="summary">
                                        <Summary data={data} {...rest}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="results">
                                        <Files jobId={data.viterbiJob.id} {...rest}/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    <Files jobId={data.viterbiJob.id} {...rest} hidden style={{display:'none'}}/>
                </Container>
            </Container></> : 
            <Error404 message="Job not found" />}
    </>
);

export default createFragmentContainer(ViewJob,
    {
        data: graphql`
            fragment ViewJob_data on Query @argumentDefinitions(
                jobId: {type: "ID!"}
            ){
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
                    ...Parameters_jobData
                }
                ...Summary_data @arguments(jobId: $jobId)
                ...LabelDropdown_data @arguments(jobId: $jobId)
            }
        `,
    },
);
