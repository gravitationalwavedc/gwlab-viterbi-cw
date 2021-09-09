import React, { useState, useEffect } from 'react';
import {createPaginationContainer, graphql} from 'react-relay';
import { Button, Container, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { HiOutlineSearch } from 'react-icons/hi';
import Link from 'found/Link';
import JobTable from '../Components/JobTable';
import GWLabLines from '../assets/gwlab_lines_3.svg';

const RECORDS_PER_PAGE = 100;

const PublicJobs = ({data, match, router, relay}) => {
    const [search, setSearch] = useState('');
    const [timeRange, setTimeRange] = useState('all');
    const [order, setOrder] = useState();
    const [direction, setDirection] = useState('descending');

    useEffect(() => handleSearchChange(), [search, timeRange, direction, order]);

    const handleSearchChange = () => {
        const refetchVariables = {
            count: RECORDS_PER_PAGE,
            search: search,
            timeRange: timeRange,
            orderBy: order,
            direction: direction
        };
        relay.refetchConnection(1, null, refetchVariables);
    };

    const loadMore = () => {
        if (relay.hasMore()) {
            relay.loadMore(RECORDS_PER_PAGE);
        }
    };

    const timeOptions = [
        {text: 'Any time', value: 'all'},
        {text: 'Past 24 hours', value: '1d'},
        {text: 'Past week', value: '1w'},
        {text: 'Past month', value: '1m'},
        {text: 'Past year', value: '1y'},
    ];

    return (
        <>
            <div className="lines">
                <GWLabLines className="gwlab-lines"/>
            </div>
            <Container fluid className="banner">
                <Container>
                    <Row>
                        <Col>
                            <h1> Viterbi</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <p className="body-2">
                                Perform <nobr>high-priority</nobr> continuous wave searches for <nobr>low-mass </nobr> 
                                <nobr>x-ray</nobr> binaries using the Viterbi pipeline.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Link as={Button} to='/viterbi/job-form/' exact match={match} router={router}>
                                New experiment
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Container >
                <h4 className="pt-5 mb-4">
                    Experiments
                </h4>
                <Form>
                    <Form.Row>
                        <Col lg={4}>
                            <Form.Group controlId="searchJobs">
                                <Form.Label srOnly>
                              Search
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <HiOutlineSearch />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control 
                                        placeholder="Search..." 
                                        value={search} 
                                        onChange={({target}) => setSearch(target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col lg={3}>
                            <Form.Group controlId="timeRange">
                                <Form.Label srOnly>
                              Time
                                </Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={timeRange} 
                                    onChange={({target}) => setTimeRange(target.value)} 
                                    custom>
                                    {timeOptions.map(option => 
                                        <option 
                                            key={option.value} 
                                            value={option.value}>
                                            {option.text}
                                        </option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col lg={4}>
                            <Link 
                                as={Button}
                                variant="outline-primary"
                                to='/viterbi/job-list/' 
                                exact 
                                match={match} 
                                router={router} 
                                className="mr-1">
                                    View my experiments
                            </Link>
                        </Col>
                    </Form.Row>
                </Form>
                <Row>
                    <Col>
                        { data.publicViterbiJobs.edges.length > 0 ? <JobTable
                            data={data.publicViterbiJobs}
                            setOrder={setOrder} 
                            order={order} 
                            setDirection={setDirection} 
                            direction={direction}
                            match={match}
                            router={router}
                            hasMore={relay.hasMore()}
                            loadMore={loadMore}
                        /> : <h5>No experiments to show. Try a different search or change the filters.</h5>}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default createPaginationContainer(PublicJobs,
    {
        data: graphql`
            fragment PublicJobs_data on Query {
                publicViterbiJobs(
                    first: $count,
                    after: $cursor,
                    search: $search,
                    timeRange: $timeRange
                ) @connection(key: "PublicJobs_publicViterbiJobs") {
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                    edges {
                        node {
                            id
                            user
                            name
                            description
                            jobStatus {
                              name
                            }
                            labels {
                                name
                            }
                        }
                    }
                }
            }
        `,
    },
    {
        direction: 'forward',
        query: graphql`
            query PublicJobsForwardQuery(
                $count: Int!,
                $cursor: String,
                $search: String,
                $timeRange: String
            ) {
              ...PublicJobs_data
            }
        `,

        getConnectionFromProps(props) {
            return props.data && props.data.publicViterbiJobs;
        },

        getFragmentVariables(previousVariables, totalCount) {
            return {
                ...previousVariables,
                count: totalCount
            };
        },
        getVariables(props, {count, cursor}, {}) {
            return {
                count,
                cursor
            };
        }
    }
);
