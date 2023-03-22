import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';

const OutputForm = ({handlePageChange}) =>
    <React.Fragment>
        <Row>
            <Col>
                <h4>Select output</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={6} xl={4}>
                <Input
                    title="Log likelihood threshold"
                    name="searchLLThreshold"
                    type="number"/>
            </Col>
        </Row>
        <PageNav
            handlePageChange={handlePageChange}
            forward={{key:'review', label: 'Review & Submit'}}
            backward={{key: 'searchParameters', label: 'Parameters'}}
        />
    </React.Fragment>;

export default OutputForm;
