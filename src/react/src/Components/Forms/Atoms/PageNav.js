import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';

const PageNav = ({handlePageChange, forward, backward}) => 
    <Row>
        <Col md={3}>
            { backward && <Button variant="tertiary" onClick={() => handlePageChange(backward.key)}>
                <HiChevronLeft/>{backward.label}
            </Button>}
        </Col>
        <Col md={3}>
            { forward && <Button onClick={() => handlePageChange(forward.key)}>
                {forward.label}<HiChevronRight/>
            </Button>}
        </Col>
    </Row>;

export default PageNav;
