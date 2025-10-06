import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="light" variant="light" expand="lg" className="border-bottom">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">Project CRM</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">Projects</Nav.Link>
                        {user?.role === 'ADMIN' && <Nav.Link as={Link} to="/audit-log">Audit Log</Nav.Link>}
                    </Nav>
                    <Nav>
                        <Navbar.Text className="me-3">Signed in as: <strong>{user?.email}</strong></Navbar.Text>
                        <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default AppNavbar;

