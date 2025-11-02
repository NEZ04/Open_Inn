import { Router } from "express";
import { getTeamRecommendations } from "../controller/matchmaking-controller.js";

const matchmakingRoutes = Router();

// Get recommended team members for a project
matchmakingRoutes.post('/recommendations', getTeamRecommendations);

export default matchmakingRoutes;
