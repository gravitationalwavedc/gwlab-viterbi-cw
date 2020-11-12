import React from 'react';
import {Button, Col, Row, Form} from 'react-bootstrap';
import FormCard from './FormCard';
import Input from './Atoms/Input';
import CheckGroup from './Atoms/CheckGroup';

const DataParametersForm = ({formik, handlePageChange}) => {
    const realData = formik.values.dataChoice === 'real';
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <FormCard title="Source Parameters">
                        {realData &&
                        <Row>
                            <Col>
                                <Form.Group controlId="sourceDataset">
                                    <Form.Label>Source Dataset</Form.Label>
                                    <Form.Control
                                        name="sourceDataset"
                                        as="select"
                                        custom
                                        {...formik.getFieldProps('sourceDataset')}>
                                        <option value='o1'>O1</option>
                                        <option value='o2'>O2</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        }
                        <Row>
                            <Col>
                                <Input formik={formik} title="Start time (GPS)" name="startTime" type="number"/>
                            </Col>
                            <Col>
                                <Input formik={formik} title="Duration (5/10m/2h/30d)" name="duration"/>
                            </Col>
                        </Row>
                    </FormCard>
                </Col>
            </Row>

            {!realData &&
            <Row>
                <Col>
                    <FormCard
                        title="Simulation Parameters">
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Signal strength (h₀)"
                                    name="h0"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Orbit projected semi-major axis (a sin i, seconds)"
                                    name="a0"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Time of ascension (GPS s)"
                                    name="orbitTp"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Signal frequency (Hz)"
                                    name="signalFrequency"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Polarisation angle (ψ, rad)"
                                    name="psi"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Inclination angle (cos ι)"
                                    name="cosi"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Right ascension (rad)"
                                    name="alpha"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Declination (rad)"
                                    name="delta"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Orbital period (s)"
                                    name="orbitPeriod"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Random seed"
                                    name="randSeed"
                                    type="number"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CheckGroup
                                    title="Interferometer(s)"
                                    formik={formik}
                                    name="ifo"
                                    options={[
                                        {label:'Hanford', value: 'hanford'},
                                        {label:'Livingston', value: 'livingston'}
                                    ]} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="One-sided noise PSD (sqrt(Sh), Hz^1/2)"
                                    name="noiseLevel"
                                    type="number"/>
                            </Col>
                        </Row>
                    </FormCard>
                </Col>
            </Row>}
            <Row>
                <Col>
                    <Button onClick={() => handlePageChange('searchParameters')}>Save and continue</Button>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default DataParametersForm;
