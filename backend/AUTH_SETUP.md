# OAuth Authentication Setup Guide

## Overview
This backend supports OAuth authentication with:
- **Google**
- **GitHub** 
- **X (Twitter)**

## Models

### User Model
- Stores user information (name, email, profile picture)
- Supports both OAuth and traditional password authentication
- Tracks last login and workspace

### Account Model
- Links OAuth providers to users
- Stores provider-specific tokens and data
- Supports multiple OAuth accounts per user
- Automatically hides sensitive tokens in API responses

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your OAuth credentials:
```bash
cp .env.example .env
```

### 3. Setup OAuth Applications

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

#### Twitter (X) OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or select existing
3. Go to "Keys and tokens"
4. Generate API Key and Secret
5. In "Authentication settings", enable OAuth 1.0a
6. Add callback URL: `http://localhost:8000/auth/twitter/callback`
7. Request email permission in app settings
8. Copy API Key and API Secret to `.env` as TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET

### 4. Start the Server
```bash
npm run dev
```

## API Endpoints

### Authentication Routes

#### Google Login
```
GET /auth/google
```
Redirects to Google login page

#### Google Callback
```
GET /auth/google/callback
```
Handles Google OAuth callback

#### GitHub Login
```
GET /auth/github
```
Redirects to GitHub login page

#### GitHub Callback
```
GET /auth/github/callback
```
Handles GitHub OAuth callback

#### Twitter Login
```
GET /auth/twitter
```
Redirects to Twitter login page

#### Twitter Callback
```
GET /auth/twitter/callback
```
Handles Twitter OAuth callback

#### Logout
```
GET /auth/logout
```
Logs out the current user

#### Get Current User
```
GET /auth/me
```
Returns the authenticated user's profile

#### Get Linked Accounts
```
GET /auth/accounts
```
Returns all OAuth accounts linked to the current user

## Frontend Integration Example

### React Example
```javascript
// Login buttons
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8000/auth/google';
};

const handleGitHubLogin = () => {
  window.location.href = 'http://localhost:8000/auth/github';
};

const handleTwitterLogin = () => {
  window.location.href = 'http://localhost:8000/auth/twitter';
};

// Check authentication status
const checkAuth = async () => {
  const response = await fetch('http://localhost:8000/auth/me', {
    credentials: 'include'
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('User:', data.user);
  }
};

// Logout
const handleLogout = async () => {
  await fetch('http://localhost:8000/auth/logout', {
    credentials: 'include'
  });
  window.location.href = '/login';
};
```

## How It Works

1. **User initiates login**: Frontend redirects to `/auth/{provider}`
2. **OAuth flow**: User authenticates with the provider
3. **Callback**: Provider redirects back to `/auth/{provider}/callback`
4. **Account linking**: 
   - If account exists → update tokens and login
   - If user exists (by email) → link new account
   - If new user → create user and account
5. **Session created**: User is logged in with session cookie
6. **Frontend redirect**: User redirected to CLIENT_URL

## Security Features

- ✅ Tokens are hidden in API responses
- ✅ Secure session management with cookie-session
- ✅ CORS configured for specific origin
- ✅ Passwords hashed with bcrypt
- ✅ Compound indexes prevent duplicate accounts

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (optional, hashed),
  profilePicture: String,
  isActive: Boolean,
  lastLogin: Date,
  currentWorkspace: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Accounts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  provider: String (google|github|twitter),
  providerId: String,
  providerEmail: String,
  accessToken: String (hidden in responses),
  refreshToken: String (hidden in responses),
  tokenExpiry: Date,
  profile: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "No email found in GitHub profile"
- Ensure your GitHub app requests email permission
- User must have a public email or grant email access

### "Redirect URI mismatch"
- Verify callback URLs match exactly in provider settings
- Check for http vs https
- Ensure port numbers match

### Session not persisting
- Check CORS credentials setting
- Verify SESSION_KEY values are set
- Ensure cookies are enabled in browser

## Production Deployment

Before deploying to production:

1. Update callback URLs to production domain
2. Generate strong random SESSION_KEY values
3. Use HTTPS for all endpoints
4. Set NODE_ENV=production
5. Restrict CORS origin to your frontend domain
6. Consider using express-session with Redis for scalability
