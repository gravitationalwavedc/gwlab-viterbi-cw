import React, { useState, useEffect } from 'react';
import {Form, Col, Row, InputGroup } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';


const DataForm = ({formik, handlePageChange}) => {
    const [useDuration, setUseDuration] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        setDuration(formik.values.maxStartTime - formik.values.minStartTime);
    }, [formik.values.maxStartTime, formik.values.minStartTime]);

    const handleDurationChange = (durationValue) => {
        const { setValue } = formik.getFieldHelpers('maxStartTime');
        const startTime = formik.values.minStartTime;
        const newEndTime = startTime + parseFloat(durationValue);
        setValue(newEndTime);
    };

    const calculateBlocks = (driftTime, duration) => Math.floor(duration / driftTime);

    const convertSecondsToDays = (seconds) => {
        const days =  seconds/ (3600 * 24);
        const roundedDays = Math.round(( days + Number.EPSILON) * 100) / 100;
        return roundedDays ;
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <h6>Select observing time period</h6>
                </Col>
                <Col md={3}>
                    <Input
                        formik={formik}
                        title="Start"
                        name="minStartTime"
                        type="number"
                        units="GPS"
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Check 
                        custom 
                        label='Use end time'
                        id='useEndTimeCheck'
                        type="radio" 
                        name='observationTimeEntryType'
                        checked={!useDuration}
                        onChange={() => setUseDuration(false)}/>
                    <Form.Check 
                        custom 
                        label='Use duration'
                        id='useDurationCheck'
                        type="radio" 
                        name='observationTimeEntryType'
                        checked={useDuration}
                        onChange={() => setUseDuration(true)} />
                </Col>
            </Row>
            { !useDuration ? <Row>
                <Col md={3}>
                    <Input
                        formik={formik}
                        title="End"
                        name="maxStartTime"
                        type="number"
                        units="GPS"
                    />
                </Col>
                <Col>
                    <p>Duration is { duration } seconds ({ convertSecondsToDays(duration) } days).</p>
                </Col>
            </Row> :
                <Row>
                    <Col md={3}>
                        <Form.Group controlId='timeDuration'>
                            <Form.Label>Duration</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    name='timeDuration'
                                    type='number' 
                                    value={ duration }
                                    onChange={(e) => handleDurationChange(e.target.value)}
                                />
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Seconds</InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <p>End time is { formik.values.maxStartTime } GPS.</p>
                    </Col>
                </Row>}
            <Row>
                <Col md={3}>
                    <Input
                        formik={formik}
                        title="Coherence (drift) time"
                        name="driftTime"
                        type="number"
                        units="seconds"
                    />
                </Col>
                <Col>
                    <p>{ calculateBlocks(formik.values.driftTime, duration) } blocks.</p>
                </Col>
            </Row>
            <PageNav 
                handlePageChange={handlePageChange}
                forward={{key: 'dataParameters', label: 'F Statistic'}}
            />
        </React.Fragment>);
};


export default DataForm;
