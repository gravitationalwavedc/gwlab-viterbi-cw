import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'found/Link';
import { HiDuplicate } from 'react-icons/hi';
import OzstarLogo from '../assets/ostar_svg.svg';

const JobCard = ({node, match, router}) =>
    <Card className="gwlab-job-card">
        <Link 
            to={{pathname: '/viterbi/job-results/' + node.id + '/'}} 
            exact 
            match={match} 
            router={router}
            className="text-body"
        >
            <Card.Body>
                <Card.Title>
                    {node.name} 
                </Card.Title>
                <Card.Subtitle>{node.description}</Card.Subtitle>
                <Card.Text>
                    <OzstarLogo style={{position: 'absolute', top: '1rem', right: '1rem', height: '2.2rem'}} />
                    <span className={`status-${node.jobStatus.name.toLowerCase()}`}>
                        {node.jobStatus.name}
                    </span>
                    {node.user}
                </Card.Text>
            </Card.Body>
        </Link>
        <Card.Footer className="text-right">
            <Link 
                to={{
                    pathname: '/viterbi/job-form/duplicate/',
                    state: {
                        jobId: node.id
                    }
                }}
                activeClassName="selected" 
                className="card-action"
                style={{fontSize: '20px'}}
                exact 
                match={match} 
                router={router}
            >
                <HiDuplicate className="mr-1 mb-1" />
                Duplicate
            </Link>
        </Card.Footer>
    </Card>
;

export default JobCard;
