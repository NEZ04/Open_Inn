import {
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
    updateTaskPrioritySchema,
    assignTaskSchema,
    taskIdSchema,
    workspaceIdSchema,
    projectIdSchema
} from "../validation/task-validation.js";
import {
    createTaskService,
    getAllTasksInProjectService,
    getTaskByIdService,
    updateTaskService,
    updateTaskStatusService,
    updateTaskPriorityService,
    assignTaskService,
    deleteTaskService,
    getMyTasksService,
    getTasksByUserService,
    getTaskAnalyticsService
} from "../services/task-service.js";
import { getMemberRoleInWorkspaceService } from "../services/member-services.js";
import { Permissions } from "../enum/role-enum.js";
import { roleGuard } from "../utils/roleGuard.js";

/**
 * Create a new task in a project
 * POST /task/workspace/:workspaceId/project/:projectId/create
 */
export const createTaskController = async (req, res) => {
    const body = createTaskSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;

    // Check user has permission to create tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(userId, workspaceId, projectId, body);

    res.status(201).json({ message: "Task created successfully", task });
};

/**
 * Get all tasks in a project
 * GET /task/workspace/:workspaceId/project/:projectId/all
 */
export const getAllTasksInProjectController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;

    // Check user has permission to view tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);

    const filters = {
        status: req.query.status,
        priority: req.query.priority,
        assignedTo: req.query.assignedTo,
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1
    };

    const { tasks, totalCount, totalPages, pageNumber, pageSize } = await getAllTasksInProjectService(
        workspaceId,
        projectId,
        filters
    );

    res.status(200).json({
        message: "Tasks retrieved successfully",
        tasks,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages
        }
    });
};

/**
 * Get task by ID
 * GET /task/:taskId/workspace/:workspaceId
 */
export const getTaskByIdController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    // Check user has permission to view tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);

    const { task } = await getTaskByIdService(taskId, workspaceId);

    res.status(200).json({ message: "Task retrieved successfully", task });
};

/**
 * Update task
 * PUT /task/:taskId/workspace/:workspaceId/update
 */
export const updateTaskController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const updateData = updateTaskSchema.parse(req.body);
    const userId = req.user?._id;

    // Check user has permission to edit tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.EDIT]);

    const { task } = await updateTaskService(taskId, workspaceId, updateData);

    res.status(200).json({ message: "Task updated successfully", task });
};

/**
 * Update task status
 * PUT /task/:taskId/workspace/:workspaceId/status
 */
export const updateTaskStatusController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const { status } = updateTaskStatusSchema.parse(req.body);
    const userId = req.user?._id;

    // Check user has permission to edit tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.EDIT]);

    const { task } = await updateTaskStatusService(taskId, workspaceId, status);

    res.status(200).json({ message: "Task status updated successfully", task });
};

/**
 * Update task priority
 * PUT /task/:taskId/workspace/:workspaceId/priority
 */
export const updateTaskPriorityController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const { priority } = updateTaskPrioritySchema.parse(req.body);
    const userId = req.user?._id;

    // Check user has permission to edit tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.EDIT]);

    const { task } = await updateTaskPriorityService(taskId, workspaceId, priority);

    res.status(200).json({ message: "Task priority updated successfully", task });
};

/**
 * Assign task to user
 * PUT /task/:taskId/workspace/:workspaceId/assign
 */
export const assignTaskController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const { assignedTo } = assignTaskSchema.parse(req.body);
    const userId = req.user?._id;

    // Check user has permission to edit tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.EDIT]);

    const { task } = await assignTaskService(taskId, workspaceId, assignedTo);

    res.status(200).json({ message: "Task assigned successfully", task });
};

/**
 * Delete task
 * DELETE /task/:taskId/workspace/:workspaceId
 */
export const deleteTaskController = async (req, res) => {
    const taskId = taskIdSchema.parse(req.params.taskId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    // Check user has permission to delete tasks
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.DELETE_TASK]);

    const { task } = await deleteTaskService(taskId, workspaceId);

    res.status(200).json({ message: "Task deleted successfully", task });
};

/**
 * Get all tasks assigned to current user in a workspace
 * GET /task/workspace/:workspaceId/my-tasks
 */
export const getMyTasksController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    // Check user is member of workspace
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);

    const filters = {
        status: req.query.status,
        priority: req.query.priority,
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1
    };

    const { tasks, totalCount, totalPages, pageNumber, pageSize } = await getMyTasksService(
        userId,
        workspaceId,
        filters
    );

    res.status(200).json({
        message: "My tasks retrieved successfully",
        tasks,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages
        }
    });
};

/**
 * Get tasks by user ID
 * GET /task/user/:userId/workspace/:workspaceId
 */
export const getTasksByUserController = async (req, res) => {
    const userId = req.params.userId;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const currentUserId = req.user?._id;

    // Check current user has permission to view tasks
    const { rolename } = await getMemberRoleInWorkspaceService(currentUserId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);

    const filters = {
        status: req.query.status,
        priority: req.query.priority,
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1
    };

    const { tasks, totalCount, totalPages, pageNumber, pageSize } = await getTasksByUserService(
        userId,
        workspaceId,
        filters
    );

    res.status(200).json({
        message: "User tasks retrieved successfully",
        tasks,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages
        }
    });
};

/**
 * Get task analytics for a project
 * GET /task/workspace/:workspaceId/project/:projectId/analytics
 */
export const getTaskAnalyticsController = async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const userId = req.user?._id;

    // Check user has permission to view analytics
    const { rolename } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(rolename, [Permissions.VIEW_ONLY]);

    const { analytics } = await getTaskAnalyticsService(workspaceId, projectId);

    res.status(200).json({ message: "Task analytics retrieved successfully", analytics });
};
