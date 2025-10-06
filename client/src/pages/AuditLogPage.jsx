import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('https://crm-system-njj1.onrender.com/api/audit', config);
                setLogs(data);
            } catch (err) { setError('Failed to fetch audit logs.'); } 
            finally { setLoading(false); }
        };
        fetchLogs();
    }, [user.token]);

    return (
        <>
            <h1 className="mb-4">Audit Log</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? <p>Loading logs...</p> : (
                <Table striped bordered hover responsive>
                    <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Project</th><th>Changes</th></tr></thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{format(new Date(log.at), 'dd MMM yyyy, HH:mm:ss')}</td>
                                <td>{log.userId?.email || 'N/A'}</td><td>{log.action}</td><td>{log.projectId?.title || 'N/A'}</td>
                                <td><div className="diff-view">{JSON.stringify(log.diff, null, 2)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default AuditLogPage;
