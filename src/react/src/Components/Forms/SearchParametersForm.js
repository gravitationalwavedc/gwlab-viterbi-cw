import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';

const SearchParametersForm = ({formik, handlePageChange}) =>
    <React.Fragment>
        <Row>
            <Col md={12}>
                <h6>Search orbital parameters</h6>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Start time (s)"
                    name="searchStartTime"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Duration (s)"
                    name="searchTBlock"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <h6>Search Parameters</h6>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Central_A0"
                    name="searchCentralA0"
                    type="number"/>
            </Col>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchA0Band"
                    type="number"/>
            </Col>
            <Col md={1}>
                <Input
                    formik={formik}
                    title="# Bins"
                    name="searchA0Bins"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <h6>Search time of ascension</h6>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Central_Tp"
                    name="searchCentralOrbitTp"
                    type="number"/>
            </Col>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchOrbitTpBand"
                    type="number"/>
            </Col>
            <Col md={1}>
                <Input
                    formik={formik}
                    title="# Bins"
                    name="searchOrbitTpBins"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <h6>Search orbital period</h6>
            </Col>
        </Row>
        <Row>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Central_P"
                    name="searchCentralP"
                    type="number"/>
            </Col>
            <Col md={2}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchPBand"
                    type="number"/>
            </Col>
            <Col md={1}>
                <Input
                    formik={formik}
                    title="# Bins"
                    name="searchPBins"
                    type="number"/>
            </Col>
        </Row>
        <PageNav
            handlePageChange={handlePageChange}
            forward={{key: 'output', label: 'Output'}}
            backward={{key: 'dataParameters', label: 'F Statistic'}}
        />
    </React.Fragment>;

export default SearchParametersForm;
