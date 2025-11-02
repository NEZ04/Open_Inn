import { Router } from "express";
import {
    completeProfile,
    getUserProfile,
    updateUserProfile
} from "../controller/profile-controller.js";

const profileRoutes = Router();

// Complete user profile (onboarding)
profileRoutes.post('/complete', completeProfile);

// Get user profile
profileRoutes.get('/:userId', getUserProfile);

// Update user profile
profileRoutes.put('/:userId', updateUserProfile);

export default profileRoutes;
