import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check credentials.');
        }
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '450px' }}>
            <Card.Header as="h4">User Login</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3"><Form.Label>Email Address</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Form.Group>
                    <Button type="submit" className="w-100">Login</Button>
                </Form>
                <div className="text-center mt-3">Don't have an account? <Link to="/signup">Sign Up</Link></div>
            </Card.Body>
        </Card>
    );
};

export default LoginPage;
