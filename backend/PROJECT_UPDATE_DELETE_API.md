# Project Management - Update & Delete API Documentation

## New Endpoints Added

### 1. Update Project
**PUT** `/api/v1/project/:id/workspace/:workspaceId/update`

Update an existing project's details.

**Required Permission:** `EDIT_PROJECT`

**Path Parameters:**
- `id` - Project ID (string)
- `workspaceId` - Workspace ID (string)

**Request Body (all fields optional, but at least one required):**
```json
{
  "emoji": "🚀",
  "name": "Updated Project Name",
  "description": "Updated project description"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "_id": "project_id",
    "emoji": "🚀",
    "name": "Updated Project Name",
    "description": "Updated project description",
    "workspace": "workspace_id",
    "techStack": ["react", "nodejs"],
    "createdBy": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "url"
    },
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T15:45:00.000Z"
  }
}
```

**Example - Update only the name:**
```json
{
  "name": "New Project Name"
}
```

**Example - Update name and emoji:**
```json
{
  "name": "New Project Name",
  "emoji": "🎨"
}
```

---

### 2. Delete Project
**DELETE** `/api/v1/project/:id/workspace/:workspaceId`

Delete a project permanently. **Warning:** This will also delete all tasks associated with this project.

**Required Permission:** `DELETE_PROJECT`

**Path Parameters:**
- `id` - Project ID (string)
- `workspaceId` - Workspace ID (string)

**Response (200):**
```json
{
  "message": "Project deleted successfully",
  "project": {
    "_id": "project_id",
    "name": "Deleted Project",
    "description": "Project description",
    "workspace": "workspace_id",
    "createdBy": "user_id",
    "createdAt": "2025-11-02T10:30:00.000Z"
  }
}
```

**Important Notes:**
- Deleting a project will **permanently delete all tasks** in that project
- This action **cannot be undone**
- Only users with `DELETE_PROJECT` permission can delete projects (Owner and Admin)

---

## Complete Project API Endpoints

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| POST | `/project/workspace/:wId/create` | Create project | CREATE_PROJECT |
| GET | `/project/workspace/:wId/all` | Get all projects | VIEW_ONLY |
| GET | `/project/:id/workspace/:wId` | Get project by ID | VIEW_ONLY |
| GET | `/project/:id/workspace/:wId/analytics` | Get project analytics | VIEW_ONLY |
| **PUT** | **`/project/:id/workspace/:wId/update`** | **Update project** | **EDIT_PROJECT** |
| **DELETE** | **`/project/:id/workspace/:wId`** | **Delete project** | **DELETE_PROJECT** |

---

## Permission Matrix

| Role | Create | View | Edit | Delete |
|------|--------|------|------|--------|
| **OWNER** | ✅ | ✅ | ✅ | ✅ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ |
| **MEMBER** | ❌ | ✅ | ❌ | ❌ |

---

## Testing with cURL

### Update Project:
```bash
curl -X PUT http://localhost:8000/api/v1/project/PROJECT_ID/workspace/WORKSPACE_ID/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

### Update only the emoji:
```bash
curl -X PUT http://localhost:8000/api/v1/project/PROJECT_ID/workspace/WORKSPACE_ID/update \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "emoji": "🎨"
  }'
```

### Delete Project:
```bash
curl -X DELETE http://localhost:8000/api/v1/project/PROJECT_ID/workspace/WORKSPACE_ID \
  -b cookies.txt
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "At least one field (emoji, name, or description) must be provided for update"
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
  "error": "Project not found in this workspace"
}
```

---

## Workflow Examples

### Example 1: Update Project Name and Description
```javascript
// Step 1: Get current project
GET /api/v1/project/123/workspace/456

// Step 2: Update project
PUT /api/v1/project/123/workspace/456/update
{
  "name": "Mobile App Development",
  "description": "Building iOS and Android apps"
}

// Response: Updated project object
```

### Example 2: Delete Project and All Tasks
```javascript
// Step 1: Check project has tasks
GET /api/v1/task/workspace/456/project/123/all

// Step 2: Confirm deletion (all tasks will be deleted)
DELETE /api/v1/project/123/workspace/456

// Result: Project and all its tasks are permanently deleted
```

---

## Important Cascading Delete Behavior

When you delete a project:
1. ✅ The project document is deleted
2. ✅ **All tasks** associated with the project are deleted
3. ✅ The operation is atomic (all or nothing)

**Before deleting a project, you may want to:**
- Export or backup important task data
- Notify team members
- Archive completed work
- Verify you have the correct project ID

---

## Validation Rules

### Update Project:
- **emoji**: Optional string (any emoji character)
- **name**: Optional string (1-255 characters) when provided
- **description**: Optional string
- **At least one field must be provided**

### Delete Project:
- Must have valid project ID
- Must have valid workspace ID
- Project must exist in the specified workspace
- User must have DELETE_PROJECT permission

---

## Use Cases

### Update Project:
- ✅ Change project name
- ✅ Update project description
- ✅ Change project emoji/icon
- ✅ Partial updates (only update what changed)

### Delete Project:
- ✅ Remove completed projects
- ✅ Clean up test/demo projects
- ✅ Remove cancelled projects
- ✅ Workspace cleanup

---

## Testing Checklist

- [ ] Update project with all fields
- [ ] Update project with single field (name only)
- [ ] Update project with emoji only
- [ ] Try update without any fields (should fail)
- [ ] Try update as MEMBER (should fail with 403)
- [ ] Try update with invalid project ID (should fail with 404)
- [ ] Delete project successfully
- [ ] Verify all tasks are deleted after project deletion
- [ ] Try delete as MEMBER (should fail with 403)
- [ ] Try delete non-existent project (should fail with 404)

---

## Summary

✅ **Update Project** - Flexible partial updates with validation  
✅ **Delete Project** - Cascading delete for project and tasks  
✅ **Permission-based** - Role-based access control  
✅ **Validated** - Input validation with Zod  
✅ **Safe** - Error handling and validation  

Both endpoints are now fully functional and ready to use! 🚀
