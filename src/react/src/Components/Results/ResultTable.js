import React from 'react';
import {Col, Row, Table} from 'react-bootstrap';

const ResultTable = ({title, subTitle, headings, data}) => 
    <Row>
        <Col md={6} className="mb-4">
            <h6>{title}</h6>
            {subTitle && <h5>{subTitle}</h5>}
            <Table>
                <thead>
                    <tr>
                        {headings.map(heading => 
                            <th key={heading}>
                                {heading}
                            </th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {data.map((dataPoint, iter) =>
                            <td key={iter}>
                                {dataPoint}
                            </td>)}
                    </tr>
                </tbody>
            </Table>
        </Col>
    </Row>;
export default ResultTable;
