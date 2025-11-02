import { Router } from "express";
import { createWorkspaceController, getAllWorkspaceUserIsMemberController, getWorkspaceByIdController, getWorkspaceMembersController, getWorkspaceAnalyticsController, changeWorkspaceMemberRoleController, updateWorkspaceIdByController, deleteWorkspaceByIdController } from "../controller/workspace-controller.js";
const workspaceRoute = Router();

workspaceRoute.post("/create", createWorkspaceController);
workspaceRoute.put("/update/:id", updateWorkspaceIdByController);
workspaceRoute.put('/change/member/role/:id', changeWorkspaceMemberRoleController);
workspaceRoute.delete("/delete/:id", deleteWorkspaceByIdController);

workspaceRoute.get("/all", getAllWorkspaceUserIsMemberController);
workspaceRoute.get("/members/:id", getWorkspaceMembersController);
workspaceRoute.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoute.get("/:id", getWorkspaceByIdController);
// workspaceRoute.get("/:id", getWorkspaceController);
// workspaceRoute.put("/:id", updateWorkspaceController);
// workspaceRoute.delete("/:id", deleteWorkspaceController);

export default workspaceRoute;