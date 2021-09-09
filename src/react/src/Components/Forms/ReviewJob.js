import React, {useState} from 'react';
import {Button, Col, Row } from 'react-bootstrap';
import ResultTable from '../Results/ResultTable';

const ReviewJob = ({values, handleSubmit, formik}) => {
    const [errors, setErrors] = useState([]);

    const submitReview = async () => {
        const errors = await formik.validateForm();
        setErrors(Object.values(errors));

        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <ResultTable 
                title='Data Settings'
                headings={['Data type', 'Start', 'End', 'Coherence']}
                data={[values.dataChoice, values.minStartTime, values.maxStartTime, values.driftTime]}
            />
            <ResultTable 
                title='F Statistic'
                subTitle='Sky position & frequency'
                headings={['Right ascension', 'Declination', 'Band start', 'Band width']}
                data={[values.alpha, values.delta, values.startFrequencyBand, values.freqBand]}
            />
            <ResultTable 
                title='Search Orbital Parameters'
                headings={['Start', 'Duration']}
                data={[values.searchStartTime, values.searchTBlock]}
            />
            <ResultTable 
                title='Search Parameters'
                headings={['Central A0', 'Band', '#Bins']}
                data={[values.searchCentralA0, values.searchA0Band, values.searchA0Bins]}
            />
            <ResultTable 
                title='Search Time of Ascension'
                headings={['Central Tp', 'Band', '#Bins']}
                data={[values.searchCentralOrbitTp, values.searchOrbitTpBand, values.searchOrbitTpBins]}
            />
            <ResultTable 
                title='Search Orbital Period'
                headings={['Central P', 'Band', '#Bins']}
                data={[values.searchCentralP, values.searchPBand, values.searchPBins]}
            />
            <ResultTable 
                title='Output'
                headings={['Log Likelihood Threshold']}
                data={[values.searchLLThreshold]}
            />
            {handleSubmit && <Row className="mb-5">
                <Col md={3}>
                    <Button onClick={submitReview}>Submit your job</Button>
                </Col>
                <Col>
                    <ul>{errors.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
                </Col>
            </Row>}
        </React.Fragment>
    );
};

ReviewJob.defaultProps = {
    handleSubmit: null
};

export default ReviewJob;
