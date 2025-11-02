import { Router } from "express";
import { joinWorkspaceController } from "../controller/member-controller.js";
const memberRoute = Router();

    memberRoute.post('/workspace/:inviteCode/join', joinWorkspaceController);

export default memberRoute;