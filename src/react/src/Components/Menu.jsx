import { Link } from 'found';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const iconStyle = {
    height: '50px',
    margin: '-2px 2px 0 0',
};

const subMenu = (name, isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Nav>
                <Nav.Link to="/" as={Link}>
                    Home
                </Nav.Link>
                <Nav.Link to="/job-list/" as={Link}>
                    My Jobs
                </Nav.Link>
                <Nav.Link to="/job-form/" as={Link}>
                    New Job
                </Nav.Link>
                <Nav.Link to="/api-token" as={Link}>
                    API Token
                </Nav.Link>
                <Nav.Link href={`${import.meta.env.VITE_BACKEND_URL}/sso/logout/`}>Logout</Nav.Link>
            </Nav>
        );
    }

    return (
        <>
            <Nav.Link to="/" as={Link}>
                Home
            </Nav.Link>
            <Nav.Link href={`${import.meta.env.VITE_BACKEND_URL}/sso/login/`}>Login</Nav.Link>
        </>
    );
};

const Menu = ({ name, isAuthenticated }) => {
    const SubMenu = subMenu(name, isAuthenticated);
    return (
        <Navbar fixed="top" className="gwlandscape-menu">
            <Navbar.Brand className="mr-auto">
                <Link to="/" exact className="navbar-brand-link">
                    GW Lab - Viterbi
                </Link>
            </Navbar.Brand>
            {SubMenu}
        </Navbar>
    );
};

export default Menu;
