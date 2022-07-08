import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import { Row } from 'react-bootstrap';
import SummaryPlot from './SummaryPlot';
import SummaryTable from './SummaryTable';


const Summary = ({data}) => {
    const vsr = data && data.viterbiSummaryResults ? data.viterbiSummaryResults : null;

    return (

        vsr ?
            <>
                <Row>
                    <SummaryTable data={JSON.parse(vsr.tableData)}/>
                </Row>
                <Row className='mt-5'>
                    <SummaryPlot data={JSON.parse(vsr.plotData)}/>
                </Row>

            </>
            : 
            <div>No summary data is available</div>
    );
};

export default createFragmentContainer(Summary, {
    data: graphql`
        fragment Summary_data on Query @argumentDefinitions(
            jobId: {type: "ID!"}
        ) {
            viterbiSummaryResults(jobId: $jobId) {
                tableData
                plotData
            }
        }
    `
});
