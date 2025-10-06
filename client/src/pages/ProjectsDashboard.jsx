import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ProjectTable from '../components/ProjectTable';
import ProjectModal from '../components/ProjectModal';
import PaginationControls from '../components/Pagination';

const ProjectsDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params: { page, search: debouncedSearch, status: statusFilter }
            };
            const { data } = await axios.get('/api/projects', config);
            setProjects(data.projects);
            setPage(data.page);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch projects.');
        } finally {
            setLoading(false);
        }
    }, [user.token, page, debouncedSearch, statusFilter]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);
    
    const handleOpenModal = (project = null) => {
        setEditingProject(project);
        setShowModal(true);
    };

    // --- THIS IS THE MISSING FUNCTION THAT HAS BEEN ADDED ---
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null); // Also clear the editing project state
    };
    // ---------------------------------------------------------

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

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    return (
        <>
            <div className="page-toolbar">
                <h1>Projects</h1>
                <Button variant="primary" onClick={() => handleOpenModal()}>Create New Project</Button>
            </div>
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by title or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col md={6}>
                    <Form.Select value={statusFilter} onChange={handleStatusFilterChange}>
                        <option value="">All Statuses</option>
                        <option value="LEAD">Lead</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="DONE">Done</option>
                    </Form.Select>
                </Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? <p>Loading projects...</p> : (
                <>
                    {projects.length > 0 ? (
                        <>
                            <ProjectTable projects={projects} onEdit={handleOpenModal} onDelete={handleDelete} />
                            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
                        </>
                    ) : (
                        <Alert variant="info" className="text-center mt-4">
                            No projects match your criteria.
                        </Alert>
                    )}
                </>
            )}
            <ProjectModal show={showModal} onHide={handleCloseModal} onSave={handleSave} project={editingProject} />
        </>
    );
};

export default ProjectsDashboard;