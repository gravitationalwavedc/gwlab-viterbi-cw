import React, { useState } from 'react';
import { Button, Col, Form, Row, InputGroup } from 'react-bootstrap';
import Input from './Input';

const MaxStartTime = ({formik, duration }) => {
    const [useDuration, setUseDuration] = useState(false);

    const convertSecondsToDays = (seconds) => {
        const days =  seconds/ (3600 * 24);
        const roundedDays = Math.round(( days + Number.EPSILON) * 100) / 100;
        return roundedDays ;
    };

    const handleDurationChange = (durationValue) => {
        const { setValue } = formik.getFieldHelpers('maxStartTime');
        const startTime = formik.values.minStartTime;
        const newEndTime = startTime + parseFloat(durationValue);
        setValue(newEndTime);
    };

    return (
        <>
            { !useDuration ? 
                <Row>
                    <Col xs={12} sm={8} md={6} xl={4}>
                        <Input
                            formik={formik}
                            title="End"
                            name="maxStartTime"
                            type="number"
                            units="GPS"
                            helpText={`Duration is ${ duration } seconds (${ convertSecondsToDays(duration) } days).`}
                        />
                        <Button 
                            variant="link" 
                            style={{ padding: 0, position: 'absolute', top:0, right: '16px' }}
                            onClick={() => setUseDuration(true)}>
                            Use duration?
                        </Button>
                    </Col>
                </Row>: 
                <Row>
                    <Col xs={12} sm={8} md={6} xl={4}>
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
                            <Form.Text>
                                <p>End time is { formik.values.maxStartTime } GPS.</p>
                            </Form.Text>
                        </Form.Group>
                        <Button 
                            variant="link" 
                            style={{ padding: 0, position: 'absolute', top:0, right: '16px' }}
                            onClick={() => setUseDuration(false)}>
                            Use end time?
                        </Button>
                    </Col>
                </Row>
            }
        </>
    );
};

export default MaxStartTime;
