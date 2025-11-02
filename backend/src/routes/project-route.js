import { Router } from "express";
import { createProjectController, getAllProjectsInWorkspaceController ,getProjectByIdAndWorkspaceIdController,getProjectAnalyticsController} from "../controller/project-controller.js";
const projectRoute = Router();
projectRoute.post('/workspace/:workspaceId/create', createProjectController);
projectRoute.get('/workspace/:workspaceId/all', getAllProjectsInWorkspaceController);
projectRoute.get("/:id/workspace/:workspaceId/analytics",getProjectAnalyticsController)
projectRoute.get("/:id/workspace/:workspaceId",getProjectByIdAndWorkspaceIdController)
export default projectRoute;
