import React from 'react';
import GWLabLines from '../assets/gwlab_lines_3.svg';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Link from 'found/Link';

const Banner = ({match, router}) => 
    <>
        <div className="lines d-none d-sm-block">
            <GWLabLines className="gwlab-lines"/>
        </div>
        <Container fluid className="banner d-none d-sm-block">
            <Container>
                <Row>
                    <Col xs={12}>
                        <h1 className="title-display"> Viterbi</h1>
                    </Col>
                    <Col md={8} className="mb-4">
                        <h5>
                            Perform <nobr>high-priority</nobr> continuous wave searches for <nobr>low-mass </nobr> 
                            <nobr>x-ray</nobr> binaries using the Viterbi pipeline.
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Link as={Button} to='/viterbi/job-form/' exact match={match} router={router}>
                            New job
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    </>;

export default Banner;
