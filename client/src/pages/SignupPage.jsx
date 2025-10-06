import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(email, password, isAdmin ? 'ADMIN' : 'MEMBER');
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign up. User may already exist.');
        }
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: '450px' }}>
            <Card.Header as="h4">Create Account</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3"><Form.Label>Email Address</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Form.Group>
                    <Form.Check type="checkbox" id="isAdmin" label="Create as Administrator Account" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="mb-3" />
                    <Button type="submit" className="w-100">Sign Up</Button>
                </Form>
                <div className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></div>
            </Card.Body>
        </Card>
    );
};

export default SignupPage;
