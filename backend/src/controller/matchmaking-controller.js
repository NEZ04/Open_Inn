import {
    generateMatchesForProject,
    generateMatchesForUser,
    getMatchesForProject,
    getMatchesForUser
} from '../services/matchmaking-service.js';
import Match from '../models/Match.js';

/**
 * Generate matches for a project
 * POST /api/matchmaking/generate
 */
export async function generateMatches(req, res, next) {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: 'Project ID is required'
            });
        }

        console.log(`🔍 Generating matches for project: ${projectId}`);

        const result = await generateMatchesForProject(projectId);

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in generateMatches controller:', error);
        next(error);
    }
}

/**
 * Generate matches for a user
 * POST /api/matchmaking/generate-user
 */
export async function generateUserMatches(req, res, next) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        console.log(`🔍 Generating matches for user: ${userId}`);

        const result = await generateMatchesForUser(userId);

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in generateUserMatches controller:', error);
        next(error);
    }
}

/**
 * Get matches for a project
 * GET /api/matchmaking/project/:projectId
 */
export async function getProjectMatches(req, res, next) {
    try {
        const { projectId } = req.params;
        const limit = parseInt(req.query.limit) || 20;

        const matches = await getMatchesForProject(projectId, limit);

        return res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error('Error in getProjectMatches controller:', error);
        next(error);
    }
}

/**
 * Get matches for a user
 * GET /api/matchmaking/user/:userId
 */
export async function getUserMatches(req, res, next) {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 20;

        const matches = await getMatchesForUser(userId, limit);

        return res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error('Error in getUserMatches controller:', error);
        next(error);
    }
}

/**
 * Get match statistics
 * GET /api/matchmaking/stats/:projectId
 */
export async function getMatchStats(req, res, next) {
    try {
        const { projectId } = req.params;

        const stats = await Match.aggregate([
            { $match: { projectId: projectId } },
            {
                $group: {
                    _id: '$matchType',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$matchScore' },
                    maxScore: { $max: '$matchScore' },
                    minScore: { $min: '$matchScore' }
                }
            }
        ]);

        const totalMatches = await Match.countDocuments({ projectId });

        return res.status(200).json({
            success: true,
            totalMatches,
            stats
        });

    } catch (error) {
        console.error('Error in getMatchStats controller:', error);
        next(error);
    }
}

// Backward compatibility with old API
export const getTeamRecommendations = generateMatches;
export const calculateMatchScore = generateUserMatches;
