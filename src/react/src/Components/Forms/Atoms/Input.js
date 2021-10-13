import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const Input = ({formik, title, name, type, units, helpText, ...rest}) =>
    <Form.Group controlId={ name }>
        <Form.Label>{ title }</Form.Label>
        <InputGroup>
            <Form.Control 
                name={ name }
                type={ type } 
                isValid={formik.touched[name] && !formik.errors[name]}
                isInvalid={!!formik.errors[name]}
                {...formik.getFieldProps(name)} 
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
            {formik.errors[name]}
        </Form.Control.Feedback>
    </Form.Group>;


export default Input;
