import React from 'react';
import {Col, Row, Table} from 'react-bootstrap';

const ResultTable = ({title, headings, data, widths}) => 
    <Row>
        <Col className="mb-4" lg={10} xl={8}>
            <h4>{title}</h4>
            <Table borderless responsive size='sm'>
                <thead>
                    <tr>
                        {headings.map((heading, iter) => 
                            <th key={heading} style={widths ? { width: widths[iter]}: {}}>
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
