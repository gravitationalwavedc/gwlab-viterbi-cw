import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const Select = ({ formik, title, name, options, units, helpText, ...rest }) => 
    <Form.Group controlId={ name }>
        <Form.Label>{ title }</Form.Label>
        <InputGroup>
            <Form.Control 
                name={ name }
                as='select'
                custom
                // isValid={formik.touched[name] && !formik.errors[name]}
                // isInvalid={!!formik.errors[name]}
                {...formik.getFieldProps(name)} 
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
            {formik.errors[name]}
        </Form.Control.Feedback>
    </Form.Group>;

export default Select;
