import React, { useState, useRef } from 'react';
import { Button, Container, Overlay, Popover, Row } from 'react-bootstrap';

const CheckButton = ({ content, cancelContent, onClick, ...props}) => {
    const [open, setOpen] = useState(false);
    const target = useRef(null);

    const handleYes = () => {
        setOpen(false);
        onClick();
    };

    return (
        <React.Fragment>
            <Button ref={target} onClick={() => setOpen(true)} {...props} onBlur={() => setOpen(false)}>
                {content}
            </Button>
            <Overlay
                placement='right'
                target={target.current}
                show={open}
            >
                {
                    (props) => (
                        <Popover {...props} id="button-popover">
                            <Popover.Title as='h3' className='bg-light'>Are you sure?</Popover.Title>
                            <Popover.Content>
                                <Container>
                                    <Row className='text text-secondary'>
                                        {cancelContent}
                                    </Row>
                                    <Row>
                                        <Button variant='outline-success' onClick={() => handleYes()}>Yes</Button>
                                        <Button variant='text text-danger' onClick={() => setOpen(false)}>No</Button>
                                    </Row>
                                </Container>
                            </Popover.Content>
                        </Popover>
                    )
                }
            </Overlay>
        </React.Fragment>
    );
};

export default CheckButton;