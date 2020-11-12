import React, { useState } from 'react';
import {commitMutation} from 'relay-runtime';
import {graphql} from 'react-relay';
import {harnessApi} from '../index';
import { Container, Col, Row, Tab, Nav } from 'react-bootstrap';
import { useFormik } from 'formik'; 
import JobTitle from '../Components/Forms/JobTitle';
import DataForm from '../Components/Forms/DataForm';
import DataParametersForm from '../Components/Forms/DataParametersForm';
import SearchParametersForm from '../Components/Forms/SearchParametersForm';
import ReviewJob from '../Components/Forms/ReviewJob';
import initialValues from '../Components/Forms/initialValues';
import validationSchema from '../Components/Forms/validationSchema';

const submitMutation = graphql`
  mutation NewJobMutation($input: ViterbiJobMutationInput!) {
    newViterbiJob(input: $input) {
      result {
        jobId
      }
    }
  }
`;

const NewJob = ({initialValues, router}) => {
    const [key, setKey] = useState('data');

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: values => handleJobSubmission(values),
        validationSchema: validationSchema,
    });

    const handleJobSubmission = (values) => {
        // The mutation requires all number values to be strings.
        Object.entries(values)
            .filter(([key, value]) => typeof(value) === 'number')
            .map(([key, value]) => values[key] = value.toString());

        const variables = {
            input: {
                start: {
                    name: values.name,
                    description: values.description,
                    private: false, 
                },
                data: {
                    dataChoice: values.dataChoice,
                    sourceDataset: values.sourceDataset,
                },
                dataParameters: {
                    startTime: values.startTime,
                    duration: values.duration,
                    h0: values.h0,
                    a0: values.a0,
                    orbitTp: values.orbitTp,
                    signalFrequency: values.signalFrequency,
                    psi: values.psi,
                    cosi: values.cosi,
                    alpha: values.alpha,
                    delta: values.delta,
                    orbitPeriod: values.orbitPeriod,
                    randSeed: values.randSeed,
                    ifo: JSON.stringify(values.ifo),
                    noiseLevel: values.noiseLevel,
                },
                searchParameters: {
                    frequency: values.frequency,
                    band: values.band,
                    a0Start: values.a0Start,
                    a0End: values.a0End,
                    a0Bins: values.a0Bins,
                    orbitTpStart: values.orbitTpStart,
                    orbitTpEnd: values.orbitTpEnd,
                    orbitTpBins: values.orbitTpBins,
                    alphaSearch: values.alphaSearch,
                    deltaSearch: values.deltaSearch,
                    orbitPeriodSearch: values.orbitPeriodSearch,
                }
            }
        };

        commitMutation(harnessApi.getEnvironment('viterbi'), {
            mutation: submitMutation,
            variables: variables,
            onCompleted: (response, errors) => {
                if (!errors) {
                    router.replace(`/viterbi/job-results/${response.newViterbiJob.result.jobId}/`);
                }
            },
        });
    };

    return (
        <Container fluid>
            <Row>
                <Col md={2}/>
                <Col md={8} style={{minHeight: '110px'}}>
                    <JobTitle formik={formik} />
                </Col>
            </Row>
            <Tab.Container id="jobForm" activeKey={key} onSelect={(key) => setKey(key)}>
                <Row>
                    <Col md={2}>
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="data">
                                    <h5>Data</h5>
                                    <p>Type and detectors</p>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="dataParameters">
                                    <h5>Data Parameters</h5>
                                    <p>Dataset and Simulation parameters</p>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="searchParameters">
                                    <h5>Search Parameters</h5>
                                    <p>Search configuration</p>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="review">
                                    <h5>Review</h5>
                                    <p>Finalise and start your job</p>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={8}>
                        <Tab.Content>
                            <Tab.Pane eventKey="data">
                                <DataForm formik={formik} handlePageChange={setKey}/>
                            </Tab.Pane>
                            <Tab.Pane data-testid="dataParametersPane" eventKey="dataParameters">
                                <DataParametersForm formik={formik} handlePageChange={setKey}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="searchParameters">
                                <SearchParametersForm formik={formik} handlePageChange={setKey}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="review">
                                <ReviewJob 
                                    formik={formik} 
                                    values={formik.values} 
                                    handleSubmit={formik.handleSubmit}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

NewJob.defaultProps = {
    initialValues: initialValues
};

export default NewJob;
