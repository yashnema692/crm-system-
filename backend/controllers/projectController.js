import Project from '../models/Project.js';
import AuditLog from '../models/AuditLog.js';

// Helper to create audit logs
const createAuditLog = async (projectId, userId, action, diff = {}) => {
    await AuditLog.create({ projectId, userId, action, diff });
};



// GET /api/projects - Now with Search, Filtering, and Pagination
export const getProjects = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build the query object based on request queries
    const query = {};
    if (req.query.status) {
        query.status = req.query.status;
    }
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i'); // Case-insensitive
        query.$or = [{ title: searchRegex }, { client: searchRegex }];
    }

    try {
        // Get the total count of documents that match the filter
        const totalCount = await Project.countDocuments(query);

        // Get the projects for the current page, applying the query
        const projects = await Project.find(query)
            .populate('ownerId', 'email')
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({
            projects,
            page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// POST /api/projects - Create a project
export const createProject = async (req, res) => {
    const { title, client, budget, status } = req.body;
    try {
        const project = await Project.create({ title, client, budget, status, ownerId: req.user._id });
        await createAuditLog(project._id, req.user._id, 'CREATE', { newData: project });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// PATCH /api/projects/:id - Update a project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Authorization: Must be admin or owner
        if (req.user.role !== 'ADMIN' && project.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const oldData = { ...project.toObject() };
        
        project.title = req.body.title || project.title;
        project.client = req.body.client || project.client;
        project.budget = req.body.budget || project.budget;
        project.status = req.body.status || project.status;

        const updatedProject = await project.save();
        await createAuditLog(project._id, req.user._id, 'UPDATE', { oldData, newData: updatedProject });
        
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// DELETE /api/projects/:id - Delete a project (Admin only)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await createAuditLog(project._id, req.user._id, 'DELETE', { deletedData: project });
            await project.deleteOne();
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


