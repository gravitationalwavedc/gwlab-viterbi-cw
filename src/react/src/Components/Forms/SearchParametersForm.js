import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import FormCard from './FormCard';

const SearchParametersForm = ({formik, handlePageChange}) =>
    <Row>
        <Col>
            <FormCard title="Frequency Parameters">
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Start frequency (Hz)"
                            name="frequency"
                            type="number"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Search band (Hz)"
                            name="band"
                            type="number"/>
                    </Col>
                </Row>
            </FormCard>
            <FormCard title="Search a sin i (s)">
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Start/Fixed"
                            name="a0Start"
                            type="number"/>
                    </Col>
                    <Col>
                        <Input
                            formik={formik}
                            title="End"
                            name="a0End"
                            type="number"/>
                    </Col>
                    <Col>
                        <Input
                            formik={formik}
                            title="# Bins"
                            name="a0Bins"
                            type="number"/>
                    </Col>
                </Row>
            </FormCard>
            <FormCard title="Search time of ascension">
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Start/Fixed"
                            name="orbitTpStart"
                            type="number"/>
                    </Col>
                    <Col>
                        <Input
                            formik={formik}
                            title="End"
                            name="orbitTpEnd"
                            type="number"/>
                    </Col>
                    <Col>
                        <Input
                            formik={formik}
                            title="# Bins"
                            name="orbitTpBins"
                            type="number"/>
                    </Col>
                </Row>
            </FormCard>
            <FormCard title="Search Parameters">
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Search right ascension (rad)"
                            name="alphaSearch"
                            type="number"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Search declination (rad)"
                            name="deltaSearch"
                            type="number"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input
                            formik={formik}
                            title="Search orbital period (s)"
                            name="orbitPeriodSearch"
                            type="number"/>
                    </Col>
                </Row>
            </FormCard>
            <Row>
                <Col>
                    <Button onClick={() => handlePageChange('review')}>Save and continue</Button>
                </Col>
            </Row>
        </Col>
    </Row>
;

export default SearchParametersForm;
