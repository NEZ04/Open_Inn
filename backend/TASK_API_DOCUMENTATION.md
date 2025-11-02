# Task Management System - API Documentation

## Overview
Complete Task Management system with CRUD operations, filtering, pagination, and analytics.

---

## Authentication
All task endpoints require authentication. Include session cookie in requests.

---

## Endpoints

### 1. Create Task
**POST** `/api/v1/task/workspace/:workspaceId/project/:projectId/create`

Create a new task in a project.

**Required Permission:** `CREATE_TASK`

**Path Parameters:**
- `workspaceId` - Workspace ID (string)
- `projectId` - Project ID (string)

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "status": "todo",
  "priority": "high",
  "assignedTo": "user_id_here",
  "dueDate": "2025-11-15T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "taskCode": "TASK-XXXXX",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication to the API",
    "workspace": "workspace_id",
    "project": "project_id",
    "status": "todo",
    "priority": "high",
    "assignedTo": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "url"
    },
    "createdBy": {
      "_id": "creator_id",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "dueDate": "2025-11-15T00:00:00.000Z",
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T10:30:00.000Z"
  }
}
```

---

### 2. Get All Tasks in Project
**GET** `/api/v1/task/workspace/:workspaceId/project/:projectId/all`

Get all tasks in a project with optional filters and pagination.

**Required Permission:** `VIEW_ONLY`

**Path Parameters:**
- `workspaceId` - Workspace ID (string)
- `projectId` - Project ID (string)

**Query Parameters:**
- `status` - Filter by status (optional: todo, in-progress, done)
- `priority` - Filter by priority (optional: low, medium, high)
- `assignedTo` - Filter by assigned user ID (optional)
- `pageSize` - Number of items per page (default: 20)
- `pageNumber` - Page number (default: 1)

**Example Request:**
```
GET /api/v1/task/workspace/123/project/456/all?status=todo&priority=high&pageSize=10&pageNumber=1
```

**Response (200):**
```json
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "_id": "task_id",
      "taskCode": "TASK-12345",
      "title": "Task title",
      "description": "Task description",
      "status": "todo",
      "priority": "high",
      "assignedTo": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdBy": {
        "_id": "creator_id",
        "name": "Jane Doe"
      },
      "dueDate": "2025-11-15T00:00:00.000Z",
      "createdAt": "2025-11-02T10:30:00.000Z"
    }
  ],
  "pagination": {
    "totalCount": 25,
    "pageSize": 10,
    "pageNumber": 1,
    "totalPages": 3
  }
}
```

---

### 3. Get Task by ID
**GET** `/api/v1/task/:taskId/workspace/:workspaceId`

Get detailed information about a specific task.

**Required Permission:** `VIEW_ONLY`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Response (200):**
```json
{
  "message": "Task retrieved successfully",
  "task": {
    "_id": "task_id",
    "taskCode": "TASK-12345",
    "title": "Task title",
    "description": "Task description",
    "status": "in-progress",
    "priority": "high",
    "workspace": "workspace_id",
    "project": {
      "_id": "project_id",
      "name": "Project Name",
      "description": "Project description"
    },
    "assignedTo": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "url"
    },
    "createdBy": {
      "_id": "creator_id",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "dueDate": "2025-11-15T00:00:00.000Z",
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T11:00:00.000Z"
  }
}
```

---

### 4. Update Task
**PUT** `/api/v1/task/:taskId/workspace/:workspaceId/update`

Update task details.

**Required Permission:** `EDIT`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Request Body (all fields optional):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "assignedTo": "new_user_id",
  "dueDate": "2025-11-20T00:00:00.000Z"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": { /* updated task object */ }
}
```

---

### 5. Update Task Status
**PUT** `/api/v1/task/:taskId/workspace/:workspaceId/status`

Update only the task status.

**Required Permission:** `EDIT`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Request Body:**
```json
{
  "status": "done"
}
```

**Valid status values:** `todo`, `in-progress`, `done`

**Response (200):**
```json
{
  "message": "Task status updated successfully",
  "task": { /* updated task object */ }
}
```

---

### 6. Update Task Priority
**PUT** `/api/v1/task/:taskId/workspace/:workspaceId/priority`

Update only the task priority.

**Required Permission:** `EDIT`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Request Body:**
```json
{
  "priority": "high"
}
```

**Valid priority values:** `low`, `medium`, `high`

**Response (200):**
```json
{
  "message": "Task priority updated successfully",
  "task": { /* updated task object */ }
}
```

---

### 7. Assign Task
**PUT** `/api/v1/task/:taskId/workspace/:workspaceId/assign`

Assign or unassign a task to a user.

**Required Permission:** `EDIT`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Request Body:**
```json
{
  "assignedTo": "user_id_here"
}
```

Set `assignedTo` to `null` to unassign the task.

**Response (200):**
```json
{
  "message": "Task assigned successfully",
  "task": { /* updated task object */ }
}
```

---

### 8. Delete Task
**DELETE** `/api/v1/task/:taskId/workspace/:workspaceId`

Delete a task permanently.

**Required Permission:** `DELETE_TASK`

**Path Parameters:**
- `taskId` - Task ID (string)
- `workspaceId` - Workspace ID (string)

**Response (200):**
```json
{
  "message": "Task deleted successfully",
  "task": { /* deleted task object */ }
}
```

---

### 9. Get My Tasks
**GET** `/api/v1/task/workspace/:workspaceId/my-tasks`

Get all tasks assigned to the current user in a workspace.

**Required Permission:** `VIEW_ONLY`

**Path Parameters:**
- `workspaceId` - Workspace ID (string)

**Query Parameters:**
- `status` - Filter by status (optional)
- `priority` - Filter by priority (optional)
- `pageSize` - Number of items per page (default: 20)
- `pageNumber` - Page number (default: 1)

**Response (200):**
```json
{
  "message": "My tasks retrieved successfully",
  "tasks": [ /* array of task objects with project info */ ],
  "pagination": {
    "totalCount": 15,
    "pageSize": 20,
    "pageNumber": 1,
    "totalPages": 1
  }
}
```

---

### 10. Get Tasks by User
**GET** `/api/v1/task/user/:userId/workspace/:workspaceId`

Get all tasks assigned to a specific user in a workspace.

**Required Permission:** `VIEW_ONLY`

**Path Parameters:**
- `userId` - User ID (string)
- `workspaceId` - Workspace ID (string)

**Query Parameters:**
- `status` - Filter by status (optional)
- `priority` - Filter by priority (optional)
- `pageSize` - Number of items per page (default: 20)
- `pageNumber` - Page number (default: 1)

**Response (200):**
```json
{
  "message": "User tasks retrieved successfully",
  "tasks": [ /* array of task objects */ ],
  "pagination": {
    "totalCount": 10,
    "pageSize": 20,
    "pageNumber": 1,
    "totalPages": 1
  }
}
```

---

### 11. Get Task Analytics
**GET** `/api/v1/task/workspace/:workspaceId/project/:projectId/analytics`

Get analytics and statistics for tasks in a project.

**Required Permission:** `VIEW_ONLY`

**Path Parameters:**
- `workspaceId` - Workspace ID (string)
- `projectId` - Project ID (string)

**Response (200):**
```json
{
  "message": "Task analytics retrieved successfully",
  "analytics": {
    "totalTasks": 50,
    "tasksByStatus": {
      "todo": 20,
      "in-progress": 15,
      "done": 15
    },
    "tasksByPriority": {
      "low": 10,
      "medium": 25,
      "high": 15
    },
    "overdueTasks": 5,
    "unassignedTasks": 8
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Permission Matrix

| Role | CREATE_TASK | EDIT_TASK | DELETE_TASK | VIEW_ONLY |
|------|-------------|-----------|-------------|-----------|
| OWNER | ✅ | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| MEMBER | ✅ | ✅ | ❌ | ✅ |

---

## Testing with cURL

### Create a task:
```bash
curl -X POST http://localhost:8000/api/v1/task/workspace/WORKSPACE_ID/project/PROJECT_ID/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "priority": "high",
    "status": "todo"
  }'
```

### Get all tasks:
```bash
curl -X GET "http://localhost:8000/api/v1/task/workspace/WORKSPACE_ID/project/PROJECT_ID/all?pageSize=10" \
  -b cookies.txt
```

### Update task status:
```bash
curl -X PUT http://localhost:8000/api/v1/task/TASK_ID/workspace/WORKSPACE_ID/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status": "in-progress"}'
```

### Get my tasks:
```bash
curl -X GET http://localhost:8000/api/v1/task/workspace/WORKSPACE_ID/my-tasks \
  -b cookies.txt
```

---

## Notes

1. **Task Code:** Each task automatically gets a unique `taskCode` (e.g., TASK-12345) generated on creation.

2. **Date Format:** All dates use ISO 8601 format (e.g., `2025-11-15T00:00:00.000Z`).

3. **Pagination:** Default page size is 20. Maximum recommended is 100.

4. **Filters:** Multiple filters can be combined in queries.

5. **Cascading Deletes:** When a project is deleted, consider implementing cascading delete for tasks.

6. **Overdue Tasks:** Tasks are considered overdue if `dueDate < current date` and `status != 'done'`.

---

## Next Steps

Consider implementing:
- Task comments/activity log
- Task attachments
- Task labels/tags
- Task time tracking
- Task dependencies
- Bulk operations
- Task templates
- Recurring tasks
