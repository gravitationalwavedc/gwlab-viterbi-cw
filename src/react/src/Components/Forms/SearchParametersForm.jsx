import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';

const SearchParametersForm = ({handlePageChange}) =>
    <React.Fragment>
        <Row>
            <Col>
                <h4>Search Range</h4>
            </Col>
        </Row>
        <Row className="form-break">
            <Col>
                <div>Orbit projected semi-major axis</div>
            </Col>
        </Row>
        <Row>
            <Col xs={3} sm={5} md={3} lg={2}>
                <Input
                    title="# Bins"
                    name="searchA0Bins"
                    type="number"
                    step="1"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Band"
                    name="searchA0Band"
                    type="number"
                    helpText="Only required if using more than 1 bin."/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Central_A0"
                    name="searchCentralA0"
                    type="number"/>
            </Col>
        </Row>
        <Row className="form-break">
            <Col>
                <div>Time of ascension</div>
            </Col>
        </Row>
        <Row>
            <Col xs={3} sm={5} md={3} lg={2}>
                <Input
                    title="# Bins"
                    name="searchOrbitTpBins"
                    type="number"
                    step="1"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Band"
                    name="searchOrbitTpBand"
                    type="number"
                    helpText="Only required if using more than 1 bin."/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Central_Tp"
                    name="searchCentralOrbitTp"
                    type="number"/>
            </Col>
        </Row>
        <Row className="form-break">
            <Col>
                <div>Orbital period</div>
            </Col>
        </Row>
        <Row>
            <Col xs={3} sm={5} md={3} lg={2}>
                <Input
                    title="# Bins"
                    name="searchPBins"
                    type="number"
                    step="1"/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Band"
                    name="searchPBand"
                    type="number"
                    helpText="Only required if using more than 1 bin."/>
            </Col>
            <Col xs={12} sm={8} md={4} xl={4}>
                <Input
                    title="Central_P"
                    name="searchCentralP"
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
