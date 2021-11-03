import React, { useState } from 'react';
import Link from 'found/Link';
import { Row, Col, Button, Container, Toast } from 'react-bootstrap';
import LabelDropdown from '../Components/Results/LabelDropdown';
import PrivacyToggle from '../Components/Results/PrivacyToggle';
import moment from 'moment';
import OzstarLogo from '../assets/ostar_svg.svg';

const JobHeading = ({data, match, router}) => {
    const [saved, setSaved] = useState(false); 
    const [showNotification, setShowNotification] = useState(false);

    const onSave = (saved) => {
        setSaved(saved);
        setShowNotification(true);
    };

    const { start, lastUpdated, userId } = data.viterbiJob;
    const updated = moment.utc(lastUpdated, 'YYYY-MM-DD HH:mm:ss UTC').local().format('llll');
    const jobStatus = data.viterbiJob.jobStatus.name.toLowerCase();

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
                        Created{updated}
                    </p>
                    <p className={`status-${jobStatus} review-heading`}>
                        {jobStatus}
                    </p>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={{span: 9, offset: 3}} xl={{span: 10, offset: 2}} xs={12}>
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
                        data={start} 
                        onUpdate={onSave} />
                </Col>
            </Row>
        </Container>);
};

export default JobHeading;
