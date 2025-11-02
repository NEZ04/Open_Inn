import { Router } from "express";
import {
    generateMatches,
    generateUserMatches,
    getProjectMatches,
    getUserMatches,
    getMatchStats
} from "../controller/matchmaking-controller.js";

const matchmakingRoutes = Router();

// Generate matches for a project
matchmakingRoutes.post('/generate', generateMatches);

// Generate matches for a user (find projects)
matchmakingRoutes.post('/generate-user', generateUserMatches);

// Get matches for a project
matchmakingRoutes.get('/project/:projectId', getProjectMatches);

// Get matches for a user
matchmakingRoutes.get('/user/:userId', getUserMatches);

// Get match statistics for a project
matchmakingRoutes.get('/stats/:projectId', getMatchStats);

export default matchmakingRoutes;
