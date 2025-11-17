import React from 'react';
import { Table } from 'react-bootstrap';

const SummaryTable = ({data}) => {
    const headings = ['log-likelihood', 'Score', 'End Frequency (Hz)', 'a0', 'T_p', 'P'];
    return <>
        <h4>Most Significant Candidates</h4>
        <Table responsive>
            <thead>
                <tr>
                    {
                        headings.map((heading) => 
                            <th key={heading}>
                                {heading}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                {
                    data.candidates.map((candidate, iter) =>
                        <tr
                            key={iter}
                            style={candidate.logL > data.logLThreshold ? {fontWeight: 'bold'} : {}}
                        >
                            <td>
                                {candidate.logL.toFixed(2)}
                            </td>
                            <td>
                                {candidate.score.toFixed(2)}
                            </td>
                            <td>
                                {candidate.frequency.toFixed(6)}
                            </td>
                            <td>
                                {candidate.asini.toFixed(5)}
                            </td>
                            <td>
                                {candidate.orbitTp.toExponential(9)}
                            </td>
                            <td>
                                {candidate.orbitPeriod.toFixed(2)}
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </Table>
        <span>
                Bold entries indicate that the candidate is above the threshold log-likelihood of {data.logLThreshold}
        </span>
    </>;
};

export default SummaryTable;