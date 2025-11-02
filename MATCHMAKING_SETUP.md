# AI Matchmaking System - Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies (if not already installed)
npm install

# Start MongoDB (if using local)
# Make sure MongoDB is running on mongodb://localhost:27017

# Start backend server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
# Tailwind CSS is configured and ready

# Start frontend
npm run dev
```

### 3. Configure Environment Variables

Edit `backend/.env` with your actual values:

```env
# CRITICAL: Update these values
MONGODB_URI=mongodb://localhost:27017/openinnovate
BASE_PATH=/api
SESSION_SECRET=generate-a-strong-random-32-char-secret-key-here

# Gemini AI API Key (already configured)
GEMINI_API_KEY=AIzaSyBIjMJp1JBdAYcfFK_feMEhHWl5xTZq_mM

# Frontend
FRONTEND_ORIGIN=http://localhost:3000
```

## 📋 System Overview

### Database Collections

1. **users** - User accounts with roles
2. **freelancerprofiles** - Skills and experience for non-project-owners
3. **projects** - Project listings with requirements
4. **matches** - AI-generated matches with scores (0-100)
5. **applications** - User applications to projects

### User Roles

- `freelancer` - Available for hire
- `project_owner` - Posts projects
- `open_source_contributor` - Contributes to OSS
- `job_seeker` - Looking for full-time positions
- `hackathon_participant` - Participates in hackathons

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Profile (Onboarding)
- `POST /api/profile/complete` - Complete profile after registration
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile

### Projects
- `POST /api/project` - Create new project
- `GET /api/project` - List all projects
- `GET /api/project/:id` - Get project details
- `PUT /api/project/:id` - Update project
- `DELETE /api/project/:id` - Delete project

### Matchmaking (AI-Powered)
- `POST /api/matchmaking/generate` - Generate matches for a project
  ```json
  { "projectId": "mongodb_object_id" }
  ```
- `POST /api/matchmaking/generate-user` - Generate matches for a user
  ```json
  { "userId": "mongodb_object_id" }
  ```
- `GET /api/matchmaking/project/:projectId` - Get matches for a project
- `GET /api/matchmaking/user/:userId` - Get matches for a user
- `GET /api/matchmaking/stats/:projectId` - Get match statistics

## 🤖 AI Matchmaking Flow

### For Project Owners:
1. Project owner creates a project
2. Call `POST /api/matchmaking/generate` with `projectId`
3. System fetches all candidates with matching skills (>30%)
4. **AI Gemini** generates personalized match scores + reasons
5. **Fallback**: If AI fails, rule-based scoring kicks in
6. Matches saved to database with `matchScore` (0-100)
7. View matches at `GET /api/matchmaking/project/:projectId`

### For Freelancers/Job Seekers:
1. User completes profile with skills
2. Call `POST /api/matchmaking/generate-user` with `userId`
3. System finds all open projects
4. AI evaluates each project for match quality
5. Fallback to rule-based if AI unavailable
6. View matches at `GET /api/matchmaking/user/:userId`

## 🎯 Onboarding Flow

After user registers/logs in:

1. Check if `profileCompleted` is `false`
2. Redirect to `/onboarding` page
3. Show form with:
   - **Common fields**: Full Name, Bio, Location, User Role
   - **For non-project-owners**: Skills, Hourly Rate, Experience, GitHub, LinkedIn, Portfolio
4. Submit to `POST /api/profile/complete`
5. Redirect to `/dashboard`

## 📊 Dashboard Views

### Freelancer Dashboard
- Shows top project matches (sorted by score DESC)
- Each match displays:
  - Match score badge (0-100) with color coding
  - Match reason from AI
  - "AI Generated" or "Rule-based" badge
  - Project details
  - "Apply" button

### Project Owner Dashboard
- Shows their posted projects
- For each project:
  - List of matched freelancers
  - Match scores
  - Freelancer profiles
  - Review applications

## 🔧 Testing the System

### 1. Create Test Users

```bash
# Register users with different roles
POST /api/auth/register
{
  "name": "John Freelancer",
  "email": "john@test.com",
  "password": "test123"
}
```

### 2. Complete Profiles

```bash
# Complete freelancer profile
POST /api/profile/complete
{
  "fullName": "John Freelancer",
  "bio": "Full-stack developer with 5 years experience",
  "location": "San Francisco",
  "userRole": "freelancer",
  "skills": ["React", "Node.js", "MongoDB", "Python"],
  "hourlyRate": 80,
  "yearsExperience": 5,
  "githubUrl": "https://github.com/john",
  "linkedinUrl": "https://linkedin.com/in/john",
  "lookingFor": "Freelance projects and startups"
}
```

### 3. Create a Project

```bash
# As project owner
POST /api/project
{
  "name": "E-commerce Platform",
  "description": "Build a modern e-commerce platform",
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "budgetMin": 5000,
  "budgetMax": 10000,
  "timeline": "3 months",
  "projectType": "freelance_gig",
  "status": "open"
}
```

### 4. Generate Matches

```bash
# Generate matches for the project
POST /api/matchmaking/generate
{
  "projectId": "your_project_id_here"
}

# Response:
{
  "success": true,
  "matchesCreated": 5,
  "message": "Successfully generated 5 matches..."
}
```

### 5. View Matches

```bash
# Get matches for the project
GET /api/matchmaking/project/:projectId

# Response includes:
{
  "success": true,
  "count": 5,
  "matches": [
    {
      "matchScore": 85,
      "matchReason": "Strong match with React, Node.js skills. 5 years experience aligns with project needs...",
      "matchType": "ai_generated",
      "skillsMatched": ["React", "Node.js", "MongoDB"],
      "freelancerId": {...},
      "freelancerProfile": {...}
    }
  ]
}
```

## 🎨 Frontend Integration

### Required Components

1. **Onboarding Page** (`/onboarding`)
   - Form with conditional fields based on role
   - Skills input (comma-separated or tags)
   - Submit to `/api/profile/complete`

2. **Dashboard Page** (`/dashboard`)
   - For freelancers: Show matched projects
   - For project owners: Show matched candidates
   - Match cards with scores and reasons

3. **Match Card Component**
   - Display match score with color coding:
     - 80-100: Green (Excellent)
     - 60-79: Blue (Good)
     - 40-59: Yellow (Fair)
     - 0-39: Gray (Low)
   - Show AI/Rule-based badge
   - Display matched skills
   - Action buttons (Apply, View Details)

## ⚡ Performance Tips

1. **Batch Processing**: Generate matches in batches to avoid timeouts
2. **Caching**: Cache project and profile data during match generation
3. **Rate Limiting**: Limit match generation to once per 5 minutes per project
4. **Pagination**: Implement pagination for match listings (20 per page)

## 🐛 Troubleshooting

### AI Not Working

- Check `GEMINI_API_KEY` in `.env`
- System automatically falls back to rule-based scoring
- Check logs for "AI failed, using fallback"

### No Matches Generated

- Ensure candidates have completed profiles (`profileCompleted: true`)
- Check skill match threshold (must be >30%)
- Verify project has `requiredSkills` or `techStack`

### Database Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify database name is correct

## 📈 Monitoring

### Match Quality Metrics

```bash
GET /api/matchmaking/stats/:projectId

# Returns:
{
  "totalMatches": 10,
  "stats": [
    {
      "_id": "ai_generated",
      "count": 7,
      "avgScore": 78.5,
      "maxScore": 95,
      "minScore": 62
    },
    {
      "_id": "rule_based_fallback",
      "count": 3,
      "avgScore": 55.2,
      "maxScore": 68,
      "minScore": 42
    }
  ]
}
```

## 🔒 Security Notes

- Never commit `.env` file
- Use strong `SESSION_SECRET` (min 32 characters)
- Validate all user inputs
- Sanitize data before AI processing
- Implement rate limiting for API endpoints

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas (cloud) instead of local
- [ ] Generate strong random `SESSION_SECRET`
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Add request logging (Winston/Pino)
- [ ] Implement API rate limiting
- [ ] Add email verification
- [ ] Set up error monitoring (Sentry optional)
- [ ] Create database indexes (already defined in models)
- [ ] Add comprehensive error handling

## 📚 Additional Resources

- Google Gemini API: https://ai.google.dev/docs
- MongoDB Documentation: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com

---

**Need Help?** Check the logs for detailed error messages and match generation progress.
