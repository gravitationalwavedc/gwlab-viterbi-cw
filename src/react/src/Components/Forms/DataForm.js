import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';
import MaxStartTime from './Atoms/MaxStartTime';


const DataForm = ({formik, handlePageChange}) => {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        setDuration(formik.values.maxStartTime - formik.values.minStartTime);
    }, [formik.values.maxStartTime, formik.values.minStartTime]);


    const calculateBlocks = (driftTime, duration) => Math.floor(duration / driftTime);

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <h4>Select observing time period</h4>
                </Col>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        formik={formik}
                        title="Start"
                        name="minStartTime"
                        type="number"
                        units="GPS"
                    />
                </Col>
            </Row>
            <MaxStartTime formik={formik} duration={duration} setDuration={setDuration} />
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        formik={formik}
                        title="Coherence (drift) time"
                        name="driftTime"
                        type="number"
                        units="Seconds"
                        helpText={`${ calculateBlocks(formik.values.driftTime, duration) } blocks.`}
                    />
                </Col>
            </Row>
            <PageNav 
                handlePageChange={handlePageChange}
                forward={{key: 'dataParameters', label: 'F Statistic'}}
            />
        </React.Fragment>);
};


export default DataForm;
