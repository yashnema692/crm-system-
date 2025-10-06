import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProjectModal = ({ show, onHide, onSave, project }) => {
    const [formData, setFormData] = useState({ title: '', client: '', budget: '', status: 'LEAD' });

    useEffect(() => {
        if (project) {
            setFormData(project);
        } else {
            setFormData({ title: '', client: '', budget: '', status: 'LEAD' });
        }
    }, [project, show]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{project ? 'Edit Project' : 'Create New Project'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Client</Form.Label>
                        <Form.Control type="text" name="client" value={formData.client} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Budget</Form.Label>
                        <Form.Control type="number" name="budget" value={formData.budget} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange}>
                            <option value="LEAD">Lead</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="ON_HOLD">On Hold</option>
                            <option value="DONE">Done</option>
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">Cancel</Button>
                        <Button variant="primary" type="submit">Save Project</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProjectModal;