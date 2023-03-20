import React from 'react';
import { useField } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';

const Input = ({title, name, type, units, helpText, ...rest}) => {
    const [field, {error, touched}] = useField(name);
    return <Form.Group controlId={ name }>
        <Form.Label>{ title }</Form.Label>
        <InputGroup>
            <Form.Control 
                {...field} 
                type={ type } 
                isValid={touched && !error}
                isInvalid={!!error}
                {...rest} />
            {units && 
            <InputGroup.Prepend>
                <InputGroup.Text>{units}</InputGroup.Text>
            </InputGroup.Prepend>}
        </InputGroup>
        <Form.Text>
            {helpText}
        </Form.Text>
        <Form.Control.Feedback type='invalid'>
            {error}
        </Form.Control.Feedback>
    </Form.Group>;
};


export default Input;
