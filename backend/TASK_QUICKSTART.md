# 🎯 Task Management System - Quick Start Guide

## ✅ Installation Complete!

The complete Task Management System has been successfully implemented in your backend.

---

## 🚀 Quick Start

### 1. Start the Backend Server

```powershell
cd backend
npm run dev
```

The server should start on `http://localhost:8000`

### 2. Verify Installation

You should see in the console:
```
Server is running on port 8000
MongoDB connected successfully
```

### 3. Test the Task Endpoints

**Prerequisites:**
- You must be logged in (have a valid session)
- You need a workspace ID
- You need a project ID in that workspace

---

## 📝 Your First Task

### Step 1: Login
```javascript
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

### Step 2: Create a Task
```javascript
POST http://localhost:8000/api/v1/task/workspace/YOUR_WORKSPACE_ID/project/YOUR_PROJECT_ID/create
Content-Type: application/json
Cookie: [your session cookie]

{
  "title": "My First Task",
  "description": "This is my first task in the system",
  "priority": "high",
  "status": "todo"
}
```

### Step 3: View All Tasks
```javascript
GET http://localhost:8000/api/v1/task/workspace/YOUR_WORKSPACE_ID/project/YOUR_PROJECT_ID/all
Cookie: [your session cookie]
```

### Step 4: Update Task Status
```javascript
PUT http://localhost:8000/api/v1/task/TASK_ID/workspace/YOUR_WORKSPACE_ID/status
Content-Type: application/json
Cookie: [your session cookie]

{
  "status": "in-progress"
}
```

---

## 🔍 Finding Your IDs

### Get Workspace ID:
```javascript
GET http://localhost:8000/api/v1/workspace/all
```

### Get Project ID:
```javascript
GET http://localhost:8000/api/v1/project/workspace/YOUR_WORKSPACE_ID/all
```

### Get User ID:
```javascript
GET http://localhost:8000/api/v1/user/current
```

---

## 📋 Available Endpoints

### Task Operations:
1. ✅ **Create Task** - `POST /task/workspace/:wId/project/:pId/create`
2. ✅ **Get All Tasks** - `GET /task/workspace/:wId/project/:pId/all`
3. ✅ **Get Task by ID** - `GET /task/:taskId/workspace/:wId`
4. ✅ **Update Task** - `PUT /task/:taskId/workspace/:wId/update`
5. ✅ **Update Status** - `PUT /task/:taskId/workspace/:wId/status`
6. ✅ **Update Priority** - `PUT /task/:taskId/workspace/:wId/priority`
7. ✅ **Assign Task** - `PUT /task/:taskId/workspace/:wId/assign`
8. ✅ **Delete Task** - `DELETE /task/:taskId/workspace/:wId`
9. ✅ **Get My Tasks** - `GET /task/workspace/:wId/my-tasks`
10. ✅ **Get User Tasks** - `GET /task/user/:userId/workspace/:wId`
11. ✅ **Get Analytics** - `GET /task/workspace/:wId/project/:pId/analytics`

---

## 🎨 Task Properties

### Required:
- `title` - Task title (string, max 200 chars)

### Optional:
- `description` - Task description (string)
- `status` - Task status (`todo`, `in-progress`, `done`)
- `priority` - Task priority (`low`, `medium`, `high`)
- `assignedTo` - User ID to assign (string or null)
- `dueDate` - Due date (ISO date string)

### Automatic:
- `taskCode` - Unique code (auto-generated)
- `workspace` - Workspace ID (from URL)
- `project` - Project ID (from URL)
- `createdBy` - Your user ID (from session)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

---

## 🔐 Permissions Required

| Operation | Owner | Admin | Member |
|-----------|-------|-------|--------|
| Create Task | ✅ | ✅ | ✅ |
| View Tasks | ✅ | ✅ | ✅ |
| Edit Task | ✅ | ✅ | ✅ |
| Delete Task | ✅ | ✅ | ❌ |

---

## 💡 Pro Tips

### 1. Use Filters
Get only high-priority tasks:
```
GET /task/workspace/:wId/project/:pId/all?priority=high
```

### 2. Combine Filters
Get in-progress tasks with high priority:
```
GET /task/workspace/:wId/project/:pId/all?status=in-progress&priority=high
```

### 3. Pagination
Get 10 tasks at a time:
```
GET /task/workspace/:wId/project/:pId/all?pageSize=10&pageNumber=1
```

### 4. View Analytics
Get task statistics:
```
GET /task/workspace/:wId/project/:pId/analytics
```

Returns:
- Total tasks
- Tasks by status (todo, in-progress, done)
- Tasks by priority (low, medium, high)
- Overdue tasks count
- Unassigned tasks count

---

## 🧪 Run Automated Tests

1. Update test file with your IDs:
```javascript
// Edit backend/test-task-management.js
const WORKSPACE_ID = 'your_workspace_id';
const PROJECT_ID = 'your_project_id';
const USER_ID = 'your_user_id';
```

2. Update login credentials:
```javascript
email: 'your_email@example.com',
password: 'your_password'
```

3. Run tests:
```bash
node test-task-management.js
```

---

## 📚 Full Documentation

For complete API documentation, see:
- **`TASK_API_DOCUMENTATION.md`** - All endpoints with examples
- **`TASK_SYSTEM_SUMMARY.md`** - Complete feature overview

---

## 🐛 Troubleshooting

### Error: "Not authenticated"
→ Make sure you're logged in and sending the session cookie

### Error: "Task not found"
→ Verify the task ID and workspace ID are correct

### Error: "You do not have permission"
→ Check your role in the workspace (Owner/Admin/Member)

### Error: "Project not found"
→ Verify the project exists in the specified workspace

### Error: "Assigned user not found"
→ Make sure the user ID in `assignedTo` is valid

---

## 🎉 You're All Set!

The Task Management System is fully operational. Start creating tasks and managing your projects!

### Next Steps:
1. Create some test tasks
2. Assign them to team members
3. Update statuses as work progresses
4. View analytics to track progress
5. Build your frontend to integrate with these APIs

Happy task managing! 🚀
