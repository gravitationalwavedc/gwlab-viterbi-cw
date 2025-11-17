import React, { useState } from 'react';
import environment from '../../environment';
import { commitMutation, createFragmentContainer, graphql } from 'react-relay';
import { Form } from 'react-bootstrap';

const PrivacyToggle = (props) => {
    const [isPrivate, setIsPrivate] = useState(props.data.private);
    
    const handleChange = () => {
        const newValue = !isPrivate;
        setIsPrivate(newValue);
        updateJob(
            {
                jobId: props.jobId,
                private: newValue,
            },
            () => {}
        );
    };
    
    return <Form.Group className="mt-3" controlId="privateToggle">
        <Form.Check
            type="checkbox"
            label="Share with LIGO collaborators"
            onChange={handleChange} 
                            disabled={true} // TODO: implement currentUser check 
            checked={!isPrivate}/>
    </Form.Group>;
};

const updateJob = (variables, callback) => commitMutation(environment, {
    mutation: graphql`
      mutation PrivacyToggleMutation($jobId: ID!, $private: Boolean, $labels: [String]) {
        updateViterbiJob(input: {jobId: $jobId, private: $private, labels: $labels}) {
          result
        }
      }
    `,
    optimisticResponse: {
        updateViterbiJob: {
            result: 'Job saved!'
        }
    },
    variables: variables,
    onCompleted: (response, errors) => {
        if (errors) {
            callback(false, errors);
        }
        else {
            callback(true, response.updateViterbiJob.result);
        }
    },
});

export default createFragmentContainer(PrivacyToggle, {
    data: graphql`
        fragment PrivacyToggle_data on OutputStartType{
            private
        }
    `
});




