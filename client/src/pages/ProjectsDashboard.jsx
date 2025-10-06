import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AppNavbar from '../components/Navbar';
import ProjectTable from '../components/ProjectTable';
import ProjectModal from '../components/ProjectModal';

const ProjectsDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const { user } = useAuth();

    const fetchProjects = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/projects', config);
            setProjects(data);
        } catch (err) {
            setError('Failed to fetch projects.');
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    const handleOpenModal = (project = null) => {
        setEditingProject(project);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSave = async (projectData) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const method = editingProject ? 'patch' : 'post';
        const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
        
        try {
            await axios[method](url, projectData, config);
            fetchProjects();
            handleCloseModal();
        } catch (err) {
            setError('Failed to save project.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/projects/${id}`, config);
                fetchProjects();
            } catch (err) {
                setError('Failed to delete project.');
            }
        }
    };

    return (
        <>
            
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Projects</h1>
                    <Button variant="primary" onClick={() => handleOpenModal()}>Create New Project</Button>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? <p>Loading...</p> : <ProjectTable projects={projects} onEdit={handleOpenModal} onDelete={handleDelete} />}
            </Container>
            <ProjectModal show={showModal} onHide={handleCloseModal} onSave={handleSave} project={editingProject} />
        </>
    );
};

export default ProjectsDashboard;