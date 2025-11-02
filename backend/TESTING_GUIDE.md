# Quick Testing Guide for OAuth Login

## Testing with Postman or Browser

### 1. Test Basic Server
```
GET http://localhost:8000/
```
Should return: `{ "message": "API is running", "authenticated": false, "user": null }`

### 2. Test Google Login Flow
1. Open browser: `http://localhost:8000/auth/google`
2. Sign in with Google
3. Should redirect to `http://localhost:3000` (or your CLIENT_URL)
4. Check authentication: `http://localhost:8000/auth/me`

### 3. Test GitHub Login Flow
1. Open browser: `http://localhost:8000/auth/github`
2. Sign in with GitHub
3. Should redirect to your frontend

### 4. Test Twitter Login Flow
1. Open browser: `http://localhost:8000/auth/twitter`
2. Sign in with Twitter/X
3. Should redirect to your frontend

### 5. Test Get Current User
```
GET http://localhost:8000/auth/me
```
Make sure to include credentials/cookies from the login

### 6. Test Get Linked Accounts
```
GET http://localhost:8000/auth/accounts
```
Returns all OAuth providers linked to your account

### 7. Test Protected Route
```
GET http://localhost:8000/user/profile
```
Requires authentication

### 8. Test Update Profile
```
PATCH http://localhost:8000/user/profile
Content-Type: application/json

{
  "name": "New Name",
  "profilePicture": "https://example.com/pic.jpg"
}
```

### 9. Test Unlink Account
```
DELETE http://localhost:8000/user/unlink/google
```
Unlinks the Google account (won't work if it's your only login method)

### 10. Test Logout
```
GET http://localhost:8000/auth/logout
```

## Testing with cURL (Windows PowerShell)

### Test after login (save session cookie)
```powershell
# Login (will redirect to OAuth provider in browser)
Start-Process "http://localhost:8000/auth/google"

# After successful login, test with cookie
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Invoke-WebRequest -Uri "http://localhost:8000/auth/me" -WebSession $session
```

## Frontend Test Page (HTML)

Create a simple test page:

```html
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Test</title>
</head>
<body>
    <h1>OAuth Login Test</h1>
    
    <div id="user-info">Not logged in</div>
    
    <button onclick="loginGoogle()">Login with Google</button>
    <button onclick="loginGitHub()">Login with GitHub</button>
    <button onclick="loginTwitter()">Login with Twitter</button>
    <button onclick="checkAuth()">Check Auth Status</button>
    <button onclick="logout()">Logout</button>
    
    <script>
        const API_URL = 'http://localhost:8000';
        
        function loginGoogle() {
            window.location.href = `${API_URL}/auth/google`;
        }
        
        function loginGitHub() {
            window.location.href = `${API_URL}/auth/github`;
        }
        
        function loginTwitter() {
            window.location.href = `${API_URL}/auth/twitter`;
        }
        
        async function checkAuth() {
            const response = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include'
            });
            const data = await response.json();
            document.getElementById('user-info').innerHTML = JSON.stringify(data, null, 2);
        }
        
        async function logout() {
            await fetch(`${API_URL}/auth/logout`, {
                credentials: 'include'
            });
            document.getElementById('user-info').innerHTML = 'Logged out';
        }
        
        // Check auth on page load
        checkAuth();
    </script>
</body>
</html>
```

Save this as `test-oauth.html` and open in browser.

## Common Issues

### Cookies not working
- Make sure `credentials: 'include'` is set in fetch requests
- Check CORS configuration includes your frontend origin
- Verify cookies are enabled in browser

### Redirect mismatch
- Ensure callback URLs in OAuth provider match exactly
- Check http vs https
- Verify port numbers match

### Email not found (GitHub)
- User needs to have public email or grant email permission
- Check OAuth app settings to request email scope
