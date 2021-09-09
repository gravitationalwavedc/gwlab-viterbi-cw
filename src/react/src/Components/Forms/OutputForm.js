import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';

const OutputForm = ({formik, handlePageChange}) =>
    <React.Fragment>
        <Row>
            <Col md={12}>
                <h6>Select output</h6>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
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
