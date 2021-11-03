import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'found/Link';
import { HiDuplicate, HiDocumentText} from 'react-icons/hi';
import OzstarLogo from '../assets/ostar_svg.svg';

const JobCard = ({node, match, router}) =>
    <Card className="gwlab-job-card">
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
        <Card.Footer className="text-right">
            <Link 
                to={{pathname: '/viterbi/job-results/' + node.id + '/'}} 
                activeClassName="selected" 
                className="card-action"
                exact 
                match={match} 
                router={router}>
                <HiDocumentText className="mr-1 mb-1" />
                    View
            </Link>
            <Link 
                to={{pathname: '/viterbi/job-form/duplicate/' + node.id + '/'}} 
                activeClassName="selected" 
                className="card-action"
                exact 
                match={match} 
                router={router}>
                <HiDuplicate className="mr-1 mb-1" />
                Duplicate
            </Link>
        </Card.Footer>
    </Card>;

export default JobCard;
