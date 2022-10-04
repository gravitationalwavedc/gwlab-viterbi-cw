import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const CheckButton = ({ buttonContent, modalTitle, modalContent, yesContent, noContent, onClick, ...props}) => {
    const [open, setOpen] = useState(false);

    const handleYes = () => {
        setOpen(false);
        onClick();
    };

    return (
        <React.Fragment>
            <Button onClick={() => setOpen(true)} {...props}>
                {buttonContent}
            </Button>
            <Modal
                size="lg"
                aria-labelledby="checkbutton-modal"
                centered
                show={open}
                onHide={() => setOpen(false)}
                contentClassName="border-primary"
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title id="checkbutton-modal">
                        {modalTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between border-0">
                    <Button variant='outline-primary' onClick={() => setOpen(false)}>
                        {noContent}
                    </Button>
                    <Button variant='outline-primary' onClick={() => handleYes()}>
                        {yesContent}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default CheckButton;