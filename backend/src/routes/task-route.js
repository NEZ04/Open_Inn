import { Router } from "express";
import {
    createTaskController,
    getAllTasksInProjectController,
    getTaskByIdController,
    updateTaskController,
    updateTaskStatusController,
    updateTaskPriorityController,
    assignTaskController,
    deleteTaskController,
    getMyTasksController,
    getTasksByUserController,
    getTaskAnalyticsController
} from "../controller/task-controller.js";

const taskRoute = Router();

// Create task in a project
taskRoute.post('/workspace/:workspaceId/project/:projectId/create', createTaskController);

// Get all tasks in a project (with filters and pagination)
taskRoute.get('/workspace/:workspaceId/project/:projectId/all', getAllTasksInProjectController);

// Get task analytics for a project
taskRoute.get('/workspace/:workspaceId/project/:projectId/analytics', getTaskAnalyticsController);

// Get my tasks (tasks assigned to current user)
taskRoute.get('/workspace/:workspaceId/my-tasks', getMyTasksController);

// Get tasks by specific user
taskRoute.get('/user/:userId/workspace/:workspaceId', getTasksByUserController);

// Get single task by ID
taskRoute.get('/:taskId/workspace/:workspaceId', getTaskByIdController);

// Update task
taskRoute.put('/:taskId/workspace/:workspaceId/update', updateTaskController);

// Update task status
taskRoute.put('/:taskId/workspace/:workspaceId/status', updateTaskStatusController);

// Update task priority
taskRoute.put('/:taskId/workspace/:workspaceId/priority', updateTaskPriorityController);

// Assign task to user
taskRoute.put('/:taskId/workspace/:workspaceId/assign', assignTaskController);

// Delete task
taskRoute.delete('/:taskId/workspace/:workspaceId', deleteTaskController);

export default taskRoute;
