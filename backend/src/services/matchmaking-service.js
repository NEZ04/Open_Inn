import User from '../models/User.js';
import FreelancerProfile from '../models/FreelancerProfile.js';
import Project from '../models/Projects.js';
import Match from '../models/Match.js';
import { generateAIMatch, calculateFallbackScore } from './gemini-service.js';

/**
 * Calculate preliminary skill match percentage
 * @param {Array<string>} projectSkills - Required skills for the project
 * @param {Array<string>} candidateSkills - Candidate's skills
 * @returns {{percentage: number, matchedSkills: Array<string>}}
 */
function calculateSkillMatch(projectSkills, candidateSkills) {
    if (!projectSkills || projectSkills.length === 0) {
        return { percentage: 0, matchedSkills: [] };
    }

    const matchedSkills = projectSkills.filter(pSkill =>
        candidateSkills.some(cSkill =>
            cSkill.toLowerCase().includes(pSkill.toLowerCase()) ||
            pSkill.toLowerCase().includes(cSkill.toLowerCase())
        )
    );

    const percentage = (matchedSkills.length / projectSkills.length) * 100;

    return { percentage, matchedSkills };
}

/**
 * Generate matches for a specific project
 * @param {string} projectId - MongoDB ObjectId of the project
 * @returns {Promise<{success: boolean, matchesCreated: number, message: string}>}
 */
export async function generateMatchesForProject(projectId) {
    try {
        // STEP 1: Fetch project with owner details
        const project = await Project.findById(projectId)
            .populate('ownerId', 'name email bio userRole')
            .lean();

        if (!project) {
            return {
                success: false,
                matchesCreated: 0,
                message: 'Project not found'
            };
        }

        // Use requiredSkills or fallback to techStack
        const projectSkills = project.requiredSkills?.length > 0 
            ? project.requiredSkills 
            : project.techStack || [];

        // STEP 2: Fetch all potential candidates (exclude project_owner role)
        const candidateRoles = ['freelancer', 'open_source_contributor', 'job_seeker', 'hackathon_participant'];
        
        const candidates = await User.aggregate([
            {
                $match: {
                    userRole: { $in: candidateRoles },
                    _id: { $ne: project.ownerId }, // Exclude project owner
                    profileCompleted: true
                }
            },
            {
                $lookup: {
                    from: 'freelancerprofiles',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'profile'
                }
            },
            {
                $match: {
                    'profile.0': { $exists: true } // Ensure profile exists
                }
            },
            { $unwind: '$profile' }
        ]);

        console.log(`Found ${candidates.length} candidates for project ${project.name}`);

        // STEP 3: Filter candidates with basic skill matching (>30% match)
        const viableCandidates = [];
        for (const candidate of candidates) {
            const candidateSkills = candidate.profile.skills || [];
            const { percentage, matchedSkills } = calculateSkillMatch(projectSkills, candidateSkills);

            if (percentage >= 30) {
                candidate.preliminaryScore = percentage;
                candidate.matchedSkills = matchedSkills;
                viableCandidates.push(candidate);
            }
        }

        console.log(`${viableCandidates.length} viable candidates after skill filtering`);

        let matchesCreated = 0;

        // STEP 4: Process each viable candidate with AI (with fallback)
        for (const candidate of viableCandidates) {
            let matchScore = 0;
            let matchReason = '';
            let matchType = 'rule_based_fallback';

            // Try AI first
            try {
                const aiResult = await generateAIMatch(
                    { ...project, owner: project.ownerId },
                    candidate
                );

                if (aiResult.success) {
                    matchScore = aiResult.score;
                    matchReason = aiResult.reason;
                    matchType = 'ai_generated';
                    console.log(`AI match for ${candidate.name}: ${matchScore}`);
                } else {
                    throw new Error('AI generation failed');
                }
            } catch (aiError) {
                console.error(`AI failed for candidate ${candidate.name}, using fallback:`, aiError.message);

                // FALLBACK: Rule-based scoring
                const fallbackResult = calculateFallbackScore(project, candidate);
                matchScore = fallbackResult.score;
                matchReason = fallbackResult.reason;
                matchType = 'rule_based_fallback';
                console.log(`Fallback match for ${candidate.name}: ${matchScore}`);
            }

            // STEP 5: Save match to database (only if score > 30)
            if (matchScore >= 30) {
                try {
                    await Match.findOneAndUpdate(
                        {
                            projectId: project._id,
                            freelancerId: candidate._id
                        },
                        {
                            $set: {
                                matchScore,
                                matchReason,
                                matchType,
                                skillsMatched: candidate.matchedSkills,
                                updatedAt: new Date()
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                                isViewed: false
                            }
                        },
                        { upsert: true, new: true }
                    );
                    matchesCreated++;
                } catch (dbError) {
                    console.error(`Failed to save match for candidate ${candidate._id}:`, dbError.message);
                }
            }
        }

        return {
            success: true,
            matchesCreated,
            message: `Successfully generated ${matchesCreated} matches for project "${project.name}"`
        };

    } catch (error) {
        console.error('Error generating matches for project:', error);
        return {
            success: false,
            matchesCreated: 0,
            message: error.message
        };
    }
}

/**
 * Generate matches for a user (shows them relevant projects)
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<{success: boolean, matchesCreated: number, message: string}>}
 */
export async function generateMatchesForUser(userId) {
    try {
        // Get user's freelancer profile
        const user = await User.findById(userId).lean();
        if (!user) {
            return {
                success: false,
                matchesCreated: 0,
                message: 'User not found'
            };
        }

        const profile = await FreelancerProfile.findOne({ userId }).lean();
        if (!profile) {
            return {
                success: false,
                matchesCreated: 0,
                message: 'Freelancer profile not found'
            };
        }

        // Combine user and profile data
        const candidate = {
            ...user,
            profile,
            fullName: user.name
        };

        // Find all open projects
        const projects = await Project.find({ status: 'open' })
            .populate('ownerId', 'name email bio userRole')
            .lean();

        console.log(`Found ${projects.length} open projects for user ${user.name}`);

        let matchesCreated = 0;

        // For each project, calculate match score
        for (const project of projects) {
            // Skip if user is the project owner
            if (project.ownerId._id.toString() === userId.toString()) {
                continue;
            }

            const projectSkills = project.requiredSkills?.length > 0 
                ? project.requiredSkills 
                : project.techStack || [];

            const { percentage, matchedSkills } = calculateSkillMatch(
                projectSkills,
                profile.skills
            );

            // Skip if skill match is too low
            if (percentage < 30) {
                continue;
            }

            candidate.preliminaryScore = percentage;
            candidate.matchedSkills = matchedSkills;

            let matchScore = 0;
            let matchReason = '';
            let matchType = 'rule_based_fallback';

            // Try AI first
            try {
                const aiResult = await generateAIMatch(
                    { ...project, owner: project.ownerId },
                    candidate
                );

                if (aiResult.success) {
                    matchScore = aiResult.score;
                    matchReason = aiResult.reason;
                    matchType = 'ai_generated';
                } else {
                    throw new Error('AI generation failed');
                }
            } catch (aiError) {
                const fallbackResult = calculateFallbackScore(project, candidate);
                matchScore = fallbackResult.score;
                matchReason = fallbackResult.reason;
                matchType = 'rule_based_fallback';
            }

            // Save match if score > 30
            if (matchScore >= 30) {
                try {
                    await Match.findOneAndUpdate(
                        {
                            projectId: project._id,
                            freelancerId: userId
                        },
                        {
                            $set: {
                                matchScore,
                                matchReason,
                                matchType,
                                skillsMatched: matchedSkills,
                                updatedAt: new Date()
                            },
                            $setOnInsert: {
                                createdAt: new Date(),
                                isViewed: false
                            }
                        },
                        { upsert: true, new: true }
                    );
                    matchesCreated++;
                } catch (dbError) {
                    console.error(`Failed to save match for project ${project._id}:`, dbError.message);
                }
            }
        }

        return {
            success: true,
            matchesCreated,
            message: `Successfully generated ${matchesCreated} matches for user "${user.name}"`
        };

    } catch (error) {
        console.error('Error generating matches for user:', error);
        return {
            success: false,
            matchesCreated: 0,
            message: error.message
        };
    }
}

/**
 * Get matches for a project (sorted by score)
 * @param {string} projectId - MongoDB ObjectId of the project
 * @param {number} limit - Maximum number of matches to return
 * @returns {Promise<Array>}
 */
export async function getMatchesForProject(projectId, limit = 20) {
    try {
        const matches = await Match.find({ projectId })
            .populate('freelancerId', 'name email bio profilePicture userRole location')
            .sort({ matchScore: -1 })
            .limit(limit)
            .lean();

        // Populate freelancer profiles
        for (const match of matches) {
            if (match.freelancerId) {
                const profile = await FreelancerProfile.findOne({ userId: match.freelancerId._id }).lean();
                match.freelancerProfile = profile;
            }
        }

        return matches;
    } catch (error) {
        console.error('Error getting matches for project:', error);
        throw error;
    }
}

/**
 * Get matches for a user (sorted by score)
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {number} limit - Maximum number of matches to return
 * @returns {Promise<Array>}
 */
export async function getMatchesForUser(userId, limit = 20) {
    try {
        const matches = await Match.find({ freelancerId: userId })
            .populate('projectId')
            .sort({ matchScore: -1 })
            .limit(limit)
            .lean();

        // Populate project owners
        for (const match of matches) {
            if (match.projectId) {
                const owner = await User.findById(match.projectId.ownerId)
                    .select('name email bio profilePicture userRole')
                    .lean();
                match.projectOwner = owner;
            }
        }

        return matches;
    } catch (error) {
        console.error('Error getting matches for user:', error);
        throw error;
    }
}
