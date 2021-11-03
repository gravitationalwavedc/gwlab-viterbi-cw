import React, { useState } from 'react';
import { Col, Row, Form, InputGroup } from 'react-bootstrap';
import Input from './Atoms/Input';
import randomRightAscensionAndDeclination from '../../helpers'; 
import PageNav from './Atoms/PageNav';
import initialValues from './initialValues';

const popularTargets = [
    { title: 'Custom'},
    { title: 'Scorpius X-1', alpha: 4.27569923849971, delta: -0.250624917263256 },
    { title: 'Surprise me...'}
];

const DataParametersForm = ({formik, handlePageChange}) => {
    const [targetSelect, setTargetSelect] = useState('Scorpius X-1');
    const [customValues, setCustomValues] = useState({alpha: 2, delta: 4});
    const [targets, setTargets] = useState({alpha: initialValues.alpha, delta: initialValues.delta});

    const setFormikValues = (alpha, delta) => {
        const formikAlpha = formik.getFieldHelpers('alpha');
        const formikDelta = formik.getFieldHelpers('delta');
        formikAlpha.setValue(alpha);
        formikDelta.setValue(delta);
    };

    const handlePopularTargetsChange = (choice) => {
        setTargetSelect(choice);
        let newTargets = {alpha: null, delta: null};

        if (choice === 'Custom'){
            newTargets = customValues;
        } else if (choice === 'Surprise me...'){
            newTargets = randomRightAscensionAndDeclination();
        } else {
            let popularChoice = popularTargets.reduce(
                (previous, current) => current.title === choice ? current : previous, null
            );
            newTargets = {alpha: popularChoice.alpha, delta: popularChoice.delta};
        }
        setTargets(newTargets);
        setFormikValues(newTargets.alpha, newTargets.delta);
    };

    const handleCustomTargetChange = (alpha, delta) => {
        setCustomValues({alpha: alpha, delta: delta});
        setTargets({alpha: alpha, delta: delta});
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
                    <Form.Group controlId="popularTargetsSelect">
                        <Form.Label>Popular Targets</Form.Label>
                        <Form.Control 
                            value={targetSelect} 
                            as="select" 
                            onChange={(e) => handlePopularTargetsChange(e.target.value)} 
                            custom>
                            {popularTargets.map(target => 
                                <option value={target.title} key={target.title}>{target.title}</option>
                            )}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Form.Group>
                        <Form.Label>Right ascension</Form.Label>
                        <InputGroup>
                            <Form.Control
                                name='alpha'
                                type='number'
                                value={targets.alpha}
                                onChange={(e) => handleCustomTargetChange(e.target.value, targets.delta)}
                            />
                            <InputGroup.Prepend>
                                <InputGroup.Text>rad</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Form.Group>
                        <Form.Label>Declination</Form.Label>
                        <InputGroup>
                            <Form.Control
                                name='delta'
                                type='number'
                                value={targets.delta}
                                onChange={(e) => handleCustomTargetChange(targets.alpha, e.target.value)}
                            />
                            <InputGroup.Prepend>
                                <InputGroup.Text>rad</InputGroup.Text>
                            </InputGroup.Prepend>
                        </InputGroup>
                    </Form.Group>
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
                        formik={formik}
                        title="Band start"
                        name="startFrequencyBand"
                        type="number"
                        units="Hz"
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={8} md={6} xl={4}>
                    <Input
                        formik={formik}
                        title="Band width"
                        name="freqBand"
                        type="number"
                        units="Hz"/>
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

