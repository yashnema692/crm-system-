import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Alert, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import AppNavbar from '../components/Navbar';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/audit', config);
                setLogs(data);
            } catch (err) {
                setError('Failed to fetch audit logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [user.token]);

    return (
        <>
            
            <Container>
                <h1 className="mb-4">Audit Log</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? <p>Loading logs...</p> : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Project</th>
                                <th>Changes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{format(new Date(log.at), 'dd MMM yyyy, HH:mm:ss')}</td>
                                    <td>{log.userId?.email || 'N/A'}</td>
                                    <td>{log.action}</td>
                                    <td>{log.projectId?.title || 'N/A'}</td>
                                    <td>
                                        <Card>
                                            <Card.Body>
                                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                                    {JSON.stringify(log.diff, null, 2)}
                                                </pre>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default AuditLogPage;