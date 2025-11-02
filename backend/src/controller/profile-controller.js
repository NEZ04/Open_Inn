import User from '../models/User.js';
import FreelancerProfile from '../models/FreelancerProfile.js';

/**
 * Complete user profile after onboarding
 * POST /api/profile/complete
 */
export async function completeProfile(req, res, next) {
    try {
        const userId = req.user._id;
        const {
            fullName,
            bio,
            location,
            userRole,
            // Freelancer-specific fields
            skills,
            hourlyRate,
            yearsExperience,
            portfolioUrl,
            githubUrl,
            linkedinUrl,
            lookingFor,
            availability,
            preferredProjectTypes
        } = req.body;

        // Validate required fields
        if (!fullName || !userRole) {
            return res.status(400).json({
                success: false,
                message: 'Full name and user role are required'
            });
        }

        // Validate userRole
        const validRoles = ['freelancer', 'project_owner', 'open_source_contributor', 'job_seeker', 'hackathon_participant'];
        if (!validRoles.includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user role'
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: fullName,
                bio: bio || '',
                location: location || '',
                userRole,
                profileCompleted: true
            },
            { new: true, select: '-password' }
        );

        // Create freelancer profile if not project_owner
        if (userRole !== 'project_owner') {
            // Validate skills for non-project-owners
            if (!skills || !Array.isArray(skills) || skills.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills are required for this role'
                });
            }

            // Check if profile already exists
            let profile = await FreelancerProfile.findOne({ userId });

            if (profile) {
                // Update existing profile
                profile = await FreelancerProfile.findOneAndUpdate(
                    { userId },
                    {
                        skills,
                        hourlyRate: hourlyRate || undefined,
                        yearsExperience: yearsExperience || 0,
                        portfolioUrl: portfolioUrl || '',
                        githubUrl: githubUrl || '',
                        linkedinUrl: linkedinUrl || '',
                        lookingFor: lookingFor || '',
                        availability: availability || 'full-time',
                        preferredProjectTypes: preferredProjectTypes || []
                    },
                    { new: true }
                );
            } else {
                // Create new profile
                profile = await FreelancerProfile.create({
                    userId,
                    skills,
                    hourlyRate: hourlyRate || undefined,
                    yearsExperience: yearsExperience || 0,
                    portfolioUrl: portfolioUrl || '',
                    githubUrl: githubUrl || '',
                    linkedinUrl: linkedinUrl || '',
                    lookingFor: lookingFor || '',
                    availability: availability || 'full-time',
                    preferredProjectTypes: preferredProjectTypes || []
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Profile completed successfully',
                user: updatedUser,
                profile
            });
        }

        // For project owners, just return updated user
        return res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error completing profile:', error);
        next(error);
    }
}

/**
 * Get user profile
 * GET /api/profile/:userId
 */
export async function getUserProfile(req, res, next) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password').lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get freelancer profile if exists
        let profile = null;
        if (user.userRole !== 'project_owner') {
            profile = await FreelancerProfile.findOne({ userId }).lean();
        }

        return res.status(200).json({
            success: true,
            user,
            profile
        });

    } catch (error) {
        console.error('Error getting user profile:', error);
        next(error);
    }
}

/**
 * Update user profile
 * PUT /api/profile/:userId
 */
export async function updateUserProfile(req, res, next) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Check if user is updating their own profile
        if (userId !== currentUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own profile'
            });
        }

        const {
            fullName,
            bio,
            location,
            // Freelancer-specific fields
            skills,
            hourlyRate,
            yearsExperience,
            portfolioUrl,
            githubUrl,
            linkedinUrl,
            lookingFor,
            availability,
            preferredProjectTypes
        } = req.body;

        // Update user
        const updateData = {};
        if (fullName) updateData.name = fullName;
        if (bio !== undefined) updateData.bio = bio;
        if (location !== undefined) updateData.location = location;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' }
        );

        // Update freelancer profile if exists
        let profile = null;
        if (updatedUser.userRole !== 'project_owner') {
            const profileUpdate = {};
            if (skills) profileUpdate.skills = skills;
            if (hourlyRate !== undefined) profileUpdate.hourlyRate = hourlyRate;
            if (yearsExperience !== undefined) profileUpdate.yearsExperience = yearsExperience;
            if (portfolioUrl !== undefined) profileUpdate.portfolioUrl = portfolioUrl;
            if (githubUrl !== undefined) profileUpdate.githubUrl = githubUrl;
            if (linkedinUrl !== undefined) profileUpdate.linkedinUrl = linkedinUrl;
            if (lookingFor !== undefined) profileUpdate.lookingFor = lookingFor;
            if (availability) profileUpdate.availability = availability;
            if (preferredProjectTypes) profileUpdate.preferredProjectTypes = preferredProjectTypes;

            profile = await FreelancerProfile.findOneAndUpdate(
                { userId },
                profileUpdate,
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
            profile
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        next(error);
    }
}
