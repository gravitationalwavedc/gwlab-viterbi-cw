import React, {useState} from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Row, Nav, Col, Button, Container, Tab, Toast } from 'react-bootstrap';
import moment from 'moment';
import Files from '../Components/Results/Files';
import Parameters from '../Components/Results/Parameters';
import Link from 'found/Link';
import LabelDropdown from '../Components/Results/LabelDropdown';
import PrivacyToggle from '../Components/Results/PrivacyToggle';

const ViewJob = ({data, match, router, ...rest}) => {
    const [saved, setSaved] = useState(false); 
    const [showNotification, setShowNotification] = useState(false);

    const onSave = (saved) => {
        setSaved(saved);
        setShowNotification(true);
    };

    const { start, lastUpdated, userId } = data.viterbiJob;

    const updated = moment.utc(lastUpdated, 'YYYY-MM-DD HH:mm:ss UTC').local().format('llll');

    return (
        <Container className="pt-5" fluid>
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
            <Row className="mb-3">
                <Col md={2} />
                <Col md={8}>
                    <h1>{start.name}</h1>
                    <p>{start.description}</p>
                    <p>Updated on {updated}</p>
                    <p>{data.viterbiJob.jobStatus.name}</p>
                    <LabelDropdown jobId={match.params.jobId} data={data} onUpdate={onSave} />
                    <Link as={Button} to={{
                        pathname: '/viterbi/job-form/duplicate/',
                        state: {
                            jobId: match.params.jobId
                        }
                    }} activeClassName="selected" exact match={match} router={router}>
                      Duplicate job
                    </Link>
                    <PrivacyToggle 
                        userId={userId} 
                        jobId={match.params.jobId} 
                        data={data.viterbiJob.start} 
                        onUpdate={onSave} />
                </Col>
            </Row>
            <Tab.Container id="jobResultsTabs" defaultActiveKey="parameters">
                <Row>
                    <Col md={2}>
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="parameters">
                                    <h5>Parameters</h5>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="results">
                                    <h5>Results</h5>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={8}>
                        <Tab.Content>
                            <Tab.Pane eventKey="parameters">
                                <Parameters jobData={data.viterbiJob} {...rest}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="results">
                                <Files jobId={data.viterbiJob.id} {...rest}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            <Files {...rest} hidden style={{display:'none'}}/>
        </Container>
    );
};

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
                    ...Parameters_jobData
                }
                ...LabelDropdown_data @arguments(jobId: $jobId)
            }
        `,
    },
);
