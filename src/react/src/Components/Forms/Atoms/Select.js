import React from 'react';
import { useField } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';

const Select = ({ title, name, options, units, helpText, ...rest }) => {
    const [field, {error, touched}] = useField(name);

    return <Form.Group controlId={ name }>
        <Form.Label>{ title }</Form.Label>
        <InputGroup>
            <Form.Control 
                {...field} 
                as='select'
                custom
                isValid={touched && !error}
                isInvalid={!!error}
                {...rest}
            >
                {options.map(({label, value}) =>
                    <option
                        id={name + label}
                        key={name + label}
                        value={value}
                    >
                        {label}
                    </option>
                )}
            </Form.Control>
            {
                units && <InputGroup.Prepend>
                    <InputGroup.Text>{units}</InputGroup.Text>
                </InputGroup.Prepend>
            }
        </InputGroup>
        <Form.Text>
            {helpText}
        </Form.Text>
        <Form.Control.Feedback type='invalid'>
            {error}
        </Form.Control.Feedback>
    </Form.Group>;
};

export default Select;
