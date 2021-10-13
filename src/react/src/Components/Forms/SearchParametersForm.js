import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';

const SearchParametersForm = ({formik, handlePageChange}) =>
    <React.Fragment>
        <Row>
            <Col>
                <h4>Search orbital parameters</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={6} xl={4}>
                <Input
                    formik={formik}
                    title="Start time"
                    name="searchStartTime"
                    type="number"
                    units="Seconds"/>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={6} xl={4}>
                <Input
                    formik={formik}
                    title="Duration"
                    name="searchTBlock"
                    type="number"
                    units="Seconds"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Search Parameters</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Central_A0"
                    name="searchCentralA0"
                    type="number"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchA0Band"
                    type="number"/>
            </Col>
            <Col xs={3} sm={5} md={3} lg={2}>
                <Input
                    formik={formik}
                    title="# Bins"
                    name="searchA0Bins"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Search time of ascension</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Central_Tp"
                    name="searchCentralOrbitTp"
                    type="number"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchOrbitTpBand"
                    type="number"/>
            </Col>
            <Col xs={3} sm={5} md={3} lg={2}>
                <Input
                    formik={formik}
                    title="# Bins"
                    name="searchOrbitTpBins"
                    type="number"/>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Search orbital period</h4>
            </Col>
        </Row>
        <Row>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Central_P"
                    name="searchCentralP"
                    type="number"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    formik={formik}
                    title="Band"
                    name="searchPBand"
                    type="number"/>
            </Col>
            <Col xs={3} sm={5} md={3} lg={2}>
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
