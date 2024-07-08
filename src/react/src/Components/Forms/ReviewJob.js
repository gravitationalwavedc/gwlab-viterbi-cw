import React, {useState} from 'react';
import { Col, Row } from 'react-bootstrap';
import ResultTable from '../Results/ResultTable';
import PageNav from './Atoms/PageNav';

const ReviewJob = ({values, handlePageChange, handleSubmit, validateForm, noButtons}) => {
    const [errors, setErrors] = useState([]);

    const submitReview = async () => {
        const errors = await validateForm();
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
                headings={['Right ascension', 'Declination', 'Band start', 'Band width']}
                data={[values.alpha, values.delta, values.startFrequencyBand, values.freqBand]}
            />
            <ResultTable 
                title='Search Range'
                headings={['Start', 'Duration']}
                data={[values.searchStartTime, values.searchTBlock]}
                widths={['30%', '70%']}
            />
            <ResultTable 
                headings={['Central Orbital Semi-major Axis', 'Band', '#Bins']}
                data={[values.searchCentralA0, values.searchA0Band, values.searchA0Bins]}
                widths={['40%', '40%', '10%']}
            />
            <ResultTable 
                headings={['Central Time of Ascension', 'Band', '#Bins']}
                data={[values.searchCentralOrbitTp, values.searchOrbitTpBand, values.searchOrbitTpBins]}
                widths={['40%', '40%', '10%']}
            />
            <ResultTable 
                headings={['Central Orbital Period', 'Band', '#Bins']}
                data={[values.searchCentralP, values.searchPBand, values.searchPBins]}
                widths={['40%', '40%', '10%']}
            />
            <ResultTable 
                title='Output'
                headings={['Log Likelihood Threshold']}
                data={[values.searchLLThreshold]}
            />
            {errors && <Row>
                <Col>
                    <ul>{errors.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
                </Col>
            </Row>}
            {!noButtons && <PageNav
                handlePageChange={handlePageChange}
                backward={{key: 'output', label: 'Output'}}
                forward={{key: 'submit', label: 'Submit'}}
                handleSubmit={submitReview}/>}
        </React.Fragment>
    );
};

ReviewJob.defaultProps = {
    handleSubmit: null
};

export default ReviewJob;
