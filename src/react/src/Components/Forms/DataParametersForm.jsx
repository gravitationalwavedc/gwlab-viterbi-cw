import React, { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import Input from './Atoms/Input';
import PageNav from './Atoms/PageNav';
import _ from 'lodash';
import Select from './Atoms/Select';
import { useFormikContext } from 'formik';

const popularTargets = [
    { title: 'Scorpius X-1', alpha: 4.27569923849971, delta: -0.250624917263256 },
];

const targetOptions = [{ title: 'Custom'}].concat(popularTargets);

const targetFromAlphaDelta = (alpha, delta) => {
    const target = popularTargets.reduce(
        (previous, current) => 
            current.alpha.toString() === alpha && current.delta.toString() === delta ? current : previous, null
    );
    return (target && target.title) || 'Custom';
};

const calculateBins = (driftTime) => {
    const fdrift = 1.0 / ( 2.0 * driftTime);
    const log2Min = Math.ceil(Math.log2(0.1 / fdrift));
    const log2Max = Math.floor(Math.log2(2.0 / fdrift));
    const logNbins = _.range(log2Min, log2Max+1);

    return logNbins.map(value => {
        const bandwidth = 2**value * fdrift;
        return {
            value: bandwidth,
            label: `${bandwidth.toFixed(8)}`
        };
    });
};

const DataParametersForm = ({handlePageChange}) => {
    const {values, setFieldValue, initialValues} = useFormikContext();
    const [customValues, setCustomValues] = useState({alpha: initialValues.alpha, delta: initialValues.delta});
    const [targetSelect, setTargetSelect] = useState(targetFromAlphaDelta(values.alpha, values.delta));
    const [bandwidthOptions, setBandwidthOptions] = useState(calculateBins(values.driftTime));

    useEffect(() => {
        const options = values.driftTime 
            ? calculateBins(values.driftTime)
            : [{value: '', label: null}];
        setBandwidthOptions(options);
        setFieldValue('freqBand', options.slice(-1)[0].value);
    }, [values.driftTime]);

    const nBins = Math.log2(2 * values.driftTime * values.freqBand);

    const setFormikValues = (alpha, delta) => {
        setFieldValue('alpha', alpha);
        setFieldValue('delta', delta);
    };

    const handlePopularTargetsChange = (choice) => {
        setTargetSelect(choice);

        const {alpha, delta} = choice === 'Custom' 
            ? customValues
            : popularTargets.reduce(
                (previous, current) => current.title === choice ? current : previous, null
            );

        setFormikValues(alpha, delta);
    };

    const handleCustomTargetChange = (alpha, delta) => {
        setCustomValues({alpha, delta});
        setFormikValues(alpha, delta);
        setTargetSelect('Custom');
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <h4>Select target position</h4>
                </Col>
                <Col xs={12} sm={8} md={6} xl={4}>
                    {/* Not using Select component because this is not a Formik field */}
                    <Form.Group controlId="popularTargetsSelect">
                        <Form.Label>Popular Targets</Form.Label>
                        <Form.Control 
                            value={targetSelect} 
                            as="select" 
                            onChange={(e) => handlePopularTargetsChange(e.target.value)} 
                            custom
                        >
                            {
                                targetOptions.map(target => 
                                    <option value={target.title} key={target.title}>{target.title}</option>
                                )
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        title='Right ascension'
                        name='alpha'
                        onChange={(e) => handleCustomTargetChange(e.target.value, values.delta)}
                        units='rad'
                    />
                </Col>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        title='Declination'
                        name='delta'
                        onChange={(e) => handleCustomTargetChange(values.alpha, e.target.value)}
                        units='rad'
                    />
                </Col>
            </Row>
            <Row>
                <Col md={12} className="form-break">
                    <h4>Select frequency settings</h4>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        title="Band start"
                        name="startFrequencyBand"
                        units="Hz"
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Select
                        title="Band width"
                        name="freqBand"
                        units="Hz"
                        options={bandwidthOptions}
                        helpText={<>This bandwidth gives 2<sup>{nBins}</sup> bins</>}
                    />
                </Col>
            </Row>
            <PageNav
                handlePageChange={handlePageChange}
                forward={{key:'searchParameters', label:'Parameters'}}
                backward={{key: 'data', label: 'Data Settings'}}
            />
        </React.Fragment>
    );
};

export default DataParametersForm;

