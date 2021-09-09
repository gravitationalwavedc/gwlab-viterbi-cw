import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'found/Link';
import { HiPencil, HiDuplicate, HiTrash} from 'react-icons/hi';

const JobCard = ({node, match, router}) => 
    <Card className="gwlab-job-card">
        <Card.Body>
            <Card.Title className="h6">{node.name} <span className={`float-right status-${node.jobStatus.name.toLowerCase()}`}>{node.jobStatus.name}</span></Card.Title>
            <Card.Subtitle className="subtitle-1">{node.description}</Card.Subtitle>
            <Card.Text>
                {node.user}
            </Card.Text>
        </Card.Body>
        <Card.Footer className="text-right">
            <Link 
                key={node.id}
                size="sm" 
                variant="outline-primary" 
                to={{pathname: '/viterbi/job-results/' + node.id + '/'}} 
                activeClassName="selected" 
                exact 
                match={match} 
                router={router}>
                <HiPencil className="mr-1 mb-1" />
                    View
            </Link>
            <Link 
                key={node.id}
                size="sm" 
                variant="outline-primary" 
                to={{pathname: '/viterbi/job-results/' + node.id + '/'}} 
                activeClassName="selected" 
                exact 
                match={match} 
                router={router}>
                <HiDuplicate className="mr-1 mb-1" />
                Copy
            </Link>
            <Link 
                key={node.id}
                size="sm" 
                variant="outline-primary" 
                to={{pathname: '/viterbi/job-results/' + node.id + '/'}} 
                activeClassName="selected" 
                exact 
                match={match} 
                router={router}>
                <HiTrash className="mr-1 mb-1" />
                Delete
            </Link>
        </Card.Footer>
    </Card>;

export default JobCard;
