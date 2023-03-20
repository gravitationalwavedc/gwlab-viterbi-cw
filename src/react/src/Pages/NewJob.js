import React, { useState } from 'react';
import {commitMutation} from 'relay-runtime';
import {graphql} from 'react-relay';
import {harnessApi} from '../index';
import { Container, Col, Row, Tab, Nav } from 'react-bootstrap'; 
import { Formik } from 'formik';
import JobTitle from '../Components/Forms/JobTitle';
import DataForm from '../Components/Forms/DataForm';
import DataParametersForm from '../Components/Forms/DataParametersForm';
import SearchParametersForm from '../Components/Forms/SearchParametersForm';
import OutputForm from '../Components/Forms/OutputForm';
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
                    startFrequencyBand: values.startFrequencyBand,
                    minStartTime: values.minStartTime,
                    maxStartTime: values.maxStartTime,
                    asini: values.asini,
                    freqBand: values.freqBand,
                    alpha: values.alpha,
                    delta: values.delta,
                    orbitTp: values.orbitTp,
                    orbitPeriod: values.orbitPeriod,
                    driftTime: values.driftTime,
                    dFreq: values.dFreq,
                },
                searchParameters: {
                    searchStartTime: values.searchStartTime,
                    searchTBlock: values.searchTBlock,
                    searchCentralA0: values.searchCentralA0,
                    searchA0Band: values.searchA0Band,
                    searchA0Bins: values.searchA0Bins,
                    searchCentralP: values.searchCentralP,
                    searchPBand: values.searchPBand,
                    searchPBins: values.searchPBins,
                    searchCentralOrbitTp: values.searchCentralOrbitTp,
                    searchOrbitTpBand: values.searchOrbitTpBand,
                    searchOrbitTpBins: values.searchOrbitTpBins,
                    searchLLThreshold: values.searchLLThreshold
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
        <Formik
            initialValues={initialValues}
            onSubmit={values => handleJobSubmission(values)}
            validationSchema={validationSchema}
        >
            {
                ({values, handleSubmit}) => (
                    <>

                        <Container>
                            <Row className="form-title-row">
                                <Col md={{span: 9, offset: 3}} xl={{span: 10, offset: 2}} xs={12}>
                                    <JobTitle />
                                </Col>
                            </Row>
                        </Container>
                        <Container className="form-container pb-5" fluid>
                            <Container>
                                <Row className="form-row">
                                    <Tab.Container id="jobForm" activeKey={key} onSelect={(key) => setKey(key)}>
                                        <Col md={3} xl={2} className="d-none d-md-block">
                                            <Nav className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="data">
                                                        <p className="text-button">Data Settings</p>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="dataParameters">
                                                        <p className="caption mb-1">Sky position & frequency</p>
                                                        <p className="text-button">F Statistic</p>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="searchParameters">
                                                        <p className="caption mb-1">Binary Orbital</p>
                                                        <p className="text-button">Parameters</p>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="output">
                                                        <p className="text-button">Output</p>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="review">
                                                        <p className="text-button">Review & Submit</p>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>
                                        <Col>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="data">
                                                    <DataForm handlePageChange={setKey}/>
                                                </Tab.Pane>
                                                <Tab.Pane data-testid="dataParametersPane" eventKey="dataParameters">
                                                    <DataParametersForm handlePageChange={setKey}/>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="searchParameters">
                                                    <SearchParametersForm handlePageChange={setKey}/>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="output">
                                                    <OutputForm handlePageChange={setKey}/>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="review">
                                                    <ReviewJob 
                                                        values={values} 
                                                        handlePageChange={setKey}
                                                        handleSubmit={handleSubmit}/>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Tab.Container>
                                </Row>
                            </Container>
                        </Container>
                    </>
                )
            }
        </Formik>
    );
};

NewJob.defaultProps = {
    initialValues: initialValues
};

export default NewJob;
