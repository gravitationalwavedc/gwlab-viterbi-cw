import React from 'react';
import {Link} from 'found';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const subMenu = () => <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <Link className="nav-link" to='/viterbi' exact>
            Experiments
        </Link>
        <Link className="nav-link" to='/viterbi/job-form' exact>
            New Experiment
        </Link>
    </Nav>
</Navbar.Collapse>;

const Menu = ({name}) => {
    const SubMenu = subMenu(name);
    return (
        <Navbar collapseOnSelect expand="md" fixed="top" className="navbar-secondary">
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                {SubMenu}
            </Container>
        </Navbar>
    );
};

// const secondaryMenu = () => 

export default Menu;
