import fetch from 'node-fetch';

/**
 * Generate AI-powered match using Google Gemini API
 * @param {Object} project - Project details with owner information
 * @param {Object} candidate - Candidate/freelancer details with profile
 * @returns {Promise<{success: boolean, score?: number, reason?: string, error?: string}>}
 */
export async function generateAIMatch(project, candidate) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not found in environment variables');
        return {
            success: false,
            error: 'API key not configured'
        };
    }

    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

    // Build project context string
    const projectContext = `
Project: ${project.title || project.name}
Description: ${project.description}
Required Skills: ${(project.requiredSkills || project.techStack || []).join(', ')}
Budget: $${project.budgetMin || 0} - $${project.budgetMax || 'Unlimited'}
Timeline: ${project.timeline || 'Not specified'}
Project Type: ${project.projectType || 'Not specified'}
Owner Bio: ${project.owner?.bio || project.owner?.[0]?.bio || 'No bio'}
    `.trim();

    // Build candidate context string
    const candidateProfile = candidate.profile || candidate;
    const candidateContext = `
Candidate: ${candidate.name || candidate.fullName}
Role: ${candidate.userRole}
Skills: ${(candidateProfile.skills || []).join(', ')}
Experience: ${candidateProfile.yearsExperience || 0} years
Hourly Rate: $${candidateProfile.hourlyRate || 'Not specified'}/hr
Bio: ${candidate.bio || 'No bio'}
GitHub: ${candidateProfile.githubUrl || 'Not provided'}
LinkedIn: ${candidateProfile.linkedinUrl || 'Not provided'}
Looking For: ${candidateProfile.lookingFor || 'Any opportunities'}
Portfolio: ${candidateProfile.portfolioUrl || 'Not provided'}
Preliminary Skill Match: ${Math.round(candidate.preliminaryScore || 0)}%
    `.trim();

    const prompt = `You are an expert AI matchmaking system for a freelance/job platform.

Analyze the following project and candidate profile to determine match quality.

PROJECT REQUIREMENTS:
${projectContext}

CANDIDATE PROFILE:
${candidateContext}

TASK: Return ONLY a valid JSON object (no markdown, no extra text) with:
1. "score": A number between 0-100 representing match quality
2. "reason": A compelling 2-3 sentence explanation of why this is a good match

Scoring criteria:
- Skill alignment (40%): How well do candidate skills match required skills?
- Experience level (20%): Is experience appropriate for project complexity?
- Budget compatibility (20%): Does hourly rate fit project budget?
- Role fit (10%): Does candidate's role align with project type?
- Profile quality (10%): Quality of portfolio, GitHub, LinkedIn presence

CRITICAL: Return ONLY valid JSON like this:
{"score": 85, "reason": "Strong match because..."}`;

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 300,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No text response from Gemini');
        }

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.includes('```json')) {
            jsonText = jsonText.split('```json')[1].split('```')[0].trim();
        } else if (jsonText.includes('```')) {
            jsonText = jsonText.split('```')[1].split('```')[0].trim();
        }

        const parsed = JSON.parse(jsonText);

        // Validate response
        if (typeof parsed.score !== 'number' || !parsed.reason) {
            throw new Error('Invalid AI response format');
        }

        // Clamp score between 0-100
        const score = Math.min(100, Math.max(0, parsed.score));

        return {
            success: true,
            score,
            reason: parsed.reason
        };

    } catch (error) {
        console.error('Gemini API Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Fallback rule-based scoring when AI fails
 * @param {Object} project - Project details
 * @param {Object} candidate - Candidate details with preliminaryScore and matchedSkills
 * @returns {{score: number, reason: string}}
 */
export function calculateFallbackScore(project, candidate) {
    let totalScore = 0;
    let reasons = [];

    const candidateProfile = candidate.profile || candidate;

    // 1. Skill Matching (40 points)
    const skillScore = (candidate.preliminaryScore || 0) * 0.4;
    totalScore += skillScore;
    if (skillScore > 20 && candidate.matchedSkills?.length > 0) {
        reasons.push(`${candidate.matchedSkills.length} matching skills (${candidate.matchedSkills.slice(0, 3).join(', ')})`);
    }

    // 2. Experience Level (20 points)
    const years = candidateProfile.yearsExperience || 0;
    let expScore = 0;
    if (years >= 5) expScore = 20;
    else if (years >= 3) expScore = 15;
    else if (years >= 1) expScore = 10;
    else expScore = 5;
    totalScore += expScore;
    if (years > 0) {
        reasons.push(`${years} years of experience`);
    }

    // 3. Budget Compatibility (20 points)
    const rate = candidateProfile.hourlyRate || 0;
    const budgetMax = project.budgetMax || Infinity;
    let budgetScore = 0;
    if (rate === 0) {
        budgetScore = 10; // No rate specified, neutral
    } else if (rate <= budgetMax * 0.5) {
        budgetScore = 20; // Well within budget
    } else if (rate <= budgetMax) {
        budgetScore = 15; // Within budget
    } else if (rate <= budgetMax * 1.2) {
        budgetScore = 10; // Slightly over
    } else {
        budgetScore = 5; // Over budget
    }
    totalScore += budgetScore;
    if (rate > 0) {
        reasons.push(`$${rate}/hr rate`);
    }

    // 4. Role Alignment (10 points)
    const roleMatch = {
        'freelance_gig': ['freelancer', 'open_source_contributor'],
        'open_source': ['open_source_contributor', 'open_source_maintainer', 'freelancer'],
        'startup': ['freelancer', 'job_seeker'],
        'full_time_job': ['job_seeker', 'freelancer'],
        'hackathon': ['hackathon_participant', 'open_source_contributor']
    };

    const preferredRoles = roleMatch[project.projectType] || [];
    const roleScore = preferredRoles.includes(candidate.userRole) ? 10 : 5;
    totalScore += roleScore;

    // 5. Profile Quality (10 points)
    let profileScore = 0;
    if (candidateProfile.portfolioUrl) profileScore += 3;
    if (candidateProfile.githubUrl) profileScore += 3;
    if (candidateProfile.linkedinUrl) profileScore += 2;
    if (candidate.bio && candidate.bio.length > 50) profileScore += 2;
    totalScore += profileScore;

    const finalScore = Math.round(Math.min(100, totalScore));
    const reason = `Good match with ${reasons.slice(0, 3).join(', ')}. Profile quality: ${profileScore}/10 points.`;

    return {
        score: finalScore,
        reason
    };
}

/**
 * Retry helper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>}
 */
export async function retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = 1000 * Math.pow(2, i);
            console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
