import Task from "../models/Task.js";
import Project from "../models/Projects.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * Create a new task in a project
 */
export const createTaskService = async (userId, workspaceId, projectId, taskData) => {
    const { title, description, status, priority, assignedTo, dueDate } = taskData;

    // Verify project exists and belongs to workspace
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        const error = new Error("Project not found in this workspace");
        error.statusCode = 404;
        throw error;
    }

    // If assignedTo is provided, verify user exists and is member of workspace
    if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            const error = new Error("Assigned user not found");
            error.statusCode = 404;
            throw error;
        }
    }

    // Create the task
    const task = await Task.create({
        title,
        description,
        workspace: workspaceId,
        project: projectId,
        status: status || 'todo',
        priority: priority || 'medium',
        assignedTo: assignedTo || null,
        createdBy: userId,
        dueDate: dueDate || null
    });

    // Populate task with user details
    await task.populate([
        { path: 'assignedTo', select: 'name email profilePicture' },
        { path: 'createdBy', select: 'name email profilePicture' }
    ]);

    return { task };
};

/**
 * Get all tasks in a project
 */
export const getAllTasksInProjectService = async (workspaceId, projectId, filters = {}) => {
    const { status, priority, assignedTo, pageSize = 20, pageNumber = 1 } = filters;

    // Verify project exists
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        const error = new Error("Project not found in this workspace");
        error.statusCode = 404;
        throw error;
    }

    // Build query
    const query = { workspace: workspaceId, project: projectId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const skip = (pageNumber - 1) * pageSize;

    const tasks = await Task.find(query)
        .populate('assignedTo', 'name email profilePicture')
        .populate('createdBy', 'name email profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return { tasks, totalCount, totalPages, pageNumber, pageSize };
};

/**
 * Get task by ID
 */
export const getTaskByIdService = async (taskId, workspaceId) => {
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId })
        .populate('assignedTo', 'name email profilePicture')
        .populate('createdBy', 'name email profilePicture')
        .populate('project', 'name description');

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return { task };
};

/**
 * Update task
 */
export const updateTaskService = async (taskId, workspaceId, updateData) => {
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    // If assignedTo is being updated, verify user exists
    if (updateData.assignedTo !== undefined && updateData.assignedTo !== null) {
        const assignedUser = await User.findById(updateData.assignedTo);
        if (!assignedUser) {
            const error = new Error("Assigned user not found");
            error.statusCode = 404;
            throw error;
        }
    }

    // Update task fields
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            task[key] = updateData[key];
        }
    });

    await task.save();

    // Populate task with user details
    await task.populate([
        { path: 'assignedTo', select: 'name email profilePicture' },
        { path: 'createdBy', select: 'name email profilePicture' },
        { path: 'project', select: 'name description' }
    ]);

    return { task };
};

/**
 * Update task status
 */
export const updateTaskStatusService = async (taskId, workspaceId, status) => {
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    task.status = status;
    await task.save();

    await task.populate([
        { path: 'assignedTo', select: 'name email profilePicture' },
        { path: 'createdBy', select: 'name email profilePicture' }
    ]);

    return { task };
};

/**
 * Update task priority
 */
export const updateTaskPriorityService = async (taskId, workspaceId, priority) => {
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    task.priority = priority;
    await task.save();

    await task.populate([
        { path: 'assignedTo', select: 'name email profilePicture' },
        { path: 'createdBy', select: 'name email profilePicture' }
    ]);

    return { task };
};

/**
 * Assign task to user
 */
export const assignTaskService = async (taskId, workspaceId, assignedTo) => {
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    // If assignedTo is not null, verify user exists
    if (assignedTo !== null) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            const error = new Error("Assigned user not found");
            error.statusCode = 404;
            throw error;
        }
    }

    task.assignedTo = assignedTo;
    await task.save();

    await task.populate([
        { path: 'assignedTo', select: 'name email profilePicture' },
        { path: 'createdBy', select: 'name email profilePicture' }
    ]);

    return { task };
};

/**
 * Delete task
 */
export const deleteTaskService = async (taskId, workspaceId) => {
    const task = await Task.findOneAndDelete({ _id: taskId, workspace: workspaceId });
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    return { task };
};

/**
 * Get all tasks assigned to current user
 */
export const getMyTasksService = async (userId, workspaceId, filters = {}) => {
    const { status, priority, pageSize = 20, pageNumber = 1 } = filters;

    const query = { workspace: workspaceId, assignedTo: userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (pageNumber - 1) * pageSize;

    const tasks = await Task.find(query)
        .populate('createdBy', 'name email profilePicture')
        .populate('project', 'name description emoji')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return { tasks, totalCount, totalPages, pageNumber, pageSize };
};

/**
 * Get tasks by user ID
 */
export const getTasksByUserService = async (userId, workspaceId, filters = {}) => {
    const { status, priority, pageSize = 20, pageNumber = 1 } = filters;

    const query = { workspace: workspaceId, assignedTo: userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (pageNumber - 1) * pageSize;

    const tasks = await Task.find(query)
        .populate('assignedTo', 'name email profilePicture')
        .populate('createdBy', 'name email profilePicture')
        .populate('project', 'name description emoji')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

    const totalCount = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return { tasks, totalCount, totalPages, pageNumber, pageSize };
};

/**
 * Get task analytics for a project
 */
export const getTaskAnalyticsService = async (workspaceId, projectId) => {
    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        const error = new Error("Project not found in this workspace");
        error.statusCode = 404;
        throw error;
    }

    const totalTasks = await Task.countDocuments({ workspace: workspaceId, project: projectId });
    
    const tasksByStatus = await Task.aggregate([
        { $match: { workspace: new mongoose.Types.ObjectId(workspaceId), project: new mongoose.Types.ObjectId(projectId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const tasksByPriority = await Task.aggregate([
        { $match: { workspace: new mongoose.Types.ObjectId(workspaceId), project: new mongoose.Types.ObjectId(projectId) } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const overdueTasks = await Task.countDocuments({
        workspace: workspaceId,
        project: projectId,
        dueDate: { $lt: new Date() },
        status: { $ne: 'done' }
    });

    const unassignedTasks = await Task.countDocuments({
        workspace: workspaceId,
        project: projectId,
        assignedTo: null
    });

    const analytics = {
        totalTasks,
        tasksByStatus: tasksByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, { todo: 0, 'in-progress': 0, done: 0 }),
        tasksByPriority: tasksByPriority.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, { low: 0, medium: 0, high: 0 }),
        overdueTasks,
        unassignedTasks
    };

    return { analytics };
};
