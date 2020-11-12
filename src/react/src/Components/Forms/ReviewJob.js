import React, {useState} from 'react';
import {Button, Col, Row, Table,} from 'react-bootstrap';
import FormCard from './FormCard';

const ReviewJob = ({values, handleSubmit, formik}) => {
    const [errors, setErrors] = useState([]);

    const submitReview = async () => {
        const errors = await formik.validateForm();
        setErrors(Object.values(errors));

        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            handleSubmit();
        }
    };

    const realData = values.dataChoice === 'real';

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <FormCard title="Data">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Data type</th>
                                    <td className="text-right">{values.dataChoice}</td>
                                </tr>
                                {realData &&
                                <tr>
                                    <th>Source Dataset</th>
                                    <td className="text-right">{values.sourceDataset}</td>
                                </tr>
                                }
                                <tr>
                                    <th>Start time (GPS)</th>
                                    <td className="text-right">{values.startTime}</td>
                                </tr>
                                <tr>
                                    <th>Duration (5/10m/2h/30d)</th>
                                    <td className="text-right">{values.duration}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    {!realData &&
                    <FormCard title="Simulation Parameters">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Signal strength (h₀)</th>
                                    <td className="text-right">{values.h0}</td>
                                </tr>
                                <tr>
                                    <th>Orbit projected semi-major axis (a sin i, seconds)</th>
                                    <td className="text-right">{values.a0}</td>
                                </tr>
                                <tr>
                                    <th>Time of ascension (GPS s)</th>
                                    <td className="text-right">{values.orbitTp}</td>
                                </tr>
                                <tr>
                                    <th>Signal frequency (Hz)</th>
                                    <td className="text-right">{values.signalFrequency}</td>
                                </tr>
                                <tr>
                                    <th>Polarisation angle (ψ, rad)</th>
                                    <td className="text-right">{values.psi}</td>
                                </tr>
                                <tr>
                                    <th>Inclination angle (cos ι)</th>
                                    <td className="text-right">{values.cosi}</td>
                                </tr>
                                <tr>
                                    <th>Right ascension (rad)</th>
                                    <td className="text-right">{values.alpha}</td>
                                </tr>
                                <tr>
                                    <th>Declination (rad)</th>
                                    <td className="text-right">{values.delta}</td>
                                </tr>
                                <tr>
                                    <th>Orbital period (s)</th>
                                    <td className="text-right">{values.orbitPeriod}</td>
                                </tr>
                                <tr>
                                    <th>Random seed</th>
                                    <td className="text-right">{values.randSeed}</td>
                                </tr>
                                <tr>
                                    <th>Interferometer(s)</th>
                                    <td className="text-right">{values.ifo.join(', ')}</td>
                                </tr>
                                <tr>
                                    <th>One-sided noise PSD (sqrt(Sh), Hz^1/2)</th>
                                    <td className="text-right">{values.noiseLevel}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    }
                    <FormCard title="Frequency Parameters">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Start frequency (Hz)</th>
                                    <td className="text-right">{values.frequency}</td>
                                </tr>
                                <tr>
                                    <th>Search band (Hz)</th>
                                    <td className="text-right">{values.band}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    <FormCard title="Search a sin i (s)">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Start/Fixed</th>
                                    <td className="text-right">{values.a0Start}</td>
                                </tr>
                                <tr>
                                    <th>End</th>
                                    <td className="text-right">{values.a0End}</td>
                                </tr>
                                <tr>
                                    <th># Bins</th>
                                    <td className="text-right">{values.a0Bins}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    <FormCard title="Search time of ascension">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Start/Fixed</th>
                                    <td className="text-right">{values.orbitTpStart}</td>
                                </tr>
                                <tr>
                                    <th>End</th>
                                    <td className="text-right">{values.orbitTpEnd}</td>
                                </tr>
                                <tr>
                                    <th># Bins</th>
                                    <td className="text-right">{values.orbitTpBins}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    <FormCard title="Search Parameters">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Search right ascension (rad)</th>
                                    <td className="text-right">{values.alphaSearch}</td>
                                </tr>
                                <tr>
                                    <th>Search declination (rad)</th>
                                    <td className="text-right">{values.deltaSearch}</td>
                                </tr>
                                <tr>
                                    <th>Search orbital period (s)</th>
                                    <td className="text-right">{values.orbitPeriodSearch}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                </Col>
            </Row>
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
