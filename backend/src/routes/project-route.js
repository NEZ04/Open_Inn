import { Router } from "express";
import { createProjectController, getAllProjectsInWorkspaceController ,getProjectByIdAndWorkspaceIdController,getProjectAnalyticsController, updateProjectController, deleteProjectController} from "../controller/project-controller.js";
const projectRoute = Router();

// Create project
projectRoute.post('/workspace/:workspaceId/create', createProjectController);

// Get all projects in workspace
projectRoute.get('/workspace/:workspaceId/all', getAllProjectsInWorkspaceController);

// Get project analytics
projectRoute.get("/:id/workspace/:workspaceId/analytics",getProjectAnalyticsController)

// Get single project
projectRoute.get("/:id/workspace/:workspaceId",getProjectByIdAndWorkspaceIdController)

// Update project
projectRoute.put("/:id/workspace/:workspaceId/update", updateProjectController);

// Delete project
projectRoute.delete("/:id/workspace/:workspaceId", deleteProjectController);

export default projectRoute;
