import fetch from 'node-fetch';

const AI_MICROSERVICE_URL = process.env.AI_MICROSERVICE_URL || 'http://localhost:8001';

/**
 * Get team member recommendations for a project
 */
export const getTeamRecommendations = async (req, res) => {
    try {
        console.log('🔍 Matchmaking endpoint called');
        const { project_requirements, candidates, top_n = 10 } = req.body;

        // Validate input
        if (!project_requirements || !candidates) {
            console.log('❌ Missing required fields');
            return res.status(400).json({
                error: 'Missing required fields: project_requirements and candidates'
            });
        }

        console.log(`📞 Calling microservice at: ${AI_MICROSERVICE_URL}`);
        
        // Call the AI microservice
        const response = await fetch(`${AI_MICROSERVICE_URL}/api/matchmaking/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_requirements,
                candidates,
                top_n
            })
        });

        if (!response.ok) {
            throw new Error(`Microservice error: ${response.statusText}`);
        }

        const matchResults = await response.json();

        res.status(200).json({
            success: true,
            data: matchResults
        });

    } catch (error) {
        console.error('Error calling matchmaking microservice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get team recommendations',
            message: error.message
        });
    }
};

/**
 * Calculate match score for a single candidate
 */
export const calculateMatchScore = async (req, res) => {
    try {
        const { project_requirements, candidate } = req.body;

        if (!project_requirements || !candidate) {
            return res.status(400).json({
                error: 'Missing required fields: project_requirements and candidate'
            });
        }

        const response = await fetch(`${AI_MICROSERVICE_URL}/api/matchmaking/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_requirements,
                candidate
            })
        });

        if (!response.ok) {
            throw new Error(`Microservice error: ${response.statusText}`);
        }

        const scoreResult = await response.json();

        res.status(200).json({
            success: true,
            data: scoreResult
        });

    } catch (error) {
        console.error('Error calculating match score:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate match score',
            message: error.message
        });
    }
};
