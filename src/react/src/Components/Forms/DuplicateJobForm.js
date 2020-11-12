import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import NewJob from '../../Pages/NewJob';

const DuplicateJobForm = (props) => {
    const jobData = props.data.viterbiJob;
    const initialValues = Object.keys(jobData).reduce((result, key) => {
        Object.keys(jobData[key]).map((item) => {
            result[item] = jobData[key][item];
        });
        return result;
    }, {});
    initialValues['name'] = `Copy-of-${initialValues.name}`;
    initialValues['description'] = `A duplicate job of ${initialValues.name}. Original description: ${initialValues.description}`;
    if (typeof initialValues['ifo'] === 'string')
        initialValues['ifo'] = JSON.parse(initialValues['ifo']);
    return <NewJob initialValues={initialValues} {...props}/>;
};

export default createFragmentContainer(DuplicateJobForm,
    {
        data: graphql`
        fragment DuplicateJobForm_data on Query @argumentDefinitions(
            jobId: {type: "ID!"}
        ){
            viterbiJob (id: $jobId){
                start {
                    name
                    description
                    private
                }
                data {
                    dataChoice
                    sourceDataset
                    startTime,
                    duration,
                    h0,
                    a0,
                    orbitTp,
                    signalFrequency,
                    psi,
                    cosi,
                    alpha,
                    delta,
                    orbitPeriod,
                    randSeed,
                    ifo,
                    noiseLevel
                }
                search {
                    frequency,
                    band,
                    a0Start,
                    a0End,
                    a0Bins,
                    orbitTpStart,
                    orbitTpEnd,
                    orbitTpBins,
                    alphaSearch,
                    deltaSearch,
                    orbitPeriodSearch
                }
            }
        }`
    }
);
