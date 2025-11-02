import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  getCurrentUser: () =>
    api.get('/user/current')
}

// Workspace APIs
export const workspaceAPI = {
  create: (data) =>
    api.post('/workspace/create', data),
  
  getAll: () =>
    api.get('/workspace/all'),
  
  getById: (id) =>
    api.get(`/workspace/${id}`),
  
  update: (id, data) =>
    api.put(`/workspace/update/${id}`, data),
  
  delete: (id) =>
    api.delete(`/workspace/delete/${id}`),
  
  getMembers: (id) =>
    api.get(`/workspace/members/${id}`),
  
  getAnalytics: (id) =>
    api.get(`/workspace/analytics/${id}`),
  
  changeMemberRole: (id, data) =>
    api.put(`/workspace/change/member/role/${id}`, data)
}

// Project APIs
export const projectAPI = {
  create: (workspaceId, data) =>
    api.post(`/project/workspace/${workspaceId}/create`, data),
  
  getAll: (workspaceId) =>
    api.get(`/project/workspace/${workspaceId}/all`),
  
  getById: (projectId, workspaceId) =>
    api.get(`/project/${projectId}/workspace/${workspaceId}`),
  
  update: (projectId, workspaceId, data) =>
    api.put(`/project/${projectId}/workspace/${workspaceId}/update`, data),
  
  delete: (projectId, workspaceId) =>
    api.delete(`/project/${projectId}/workspace/${workspaceId}`),
  
  getAnalytics: (projectId, workspaceId) =>
    api.get(`/project/${projectId}/workspace/${workspaceId}/analytics`)
}

// Task APIs
export const taskAPI = {
  create: (workspaceId, projectId, data) =>
    api.post(`/task/workspace/${workspaceId}/project/${projectId}/create`, data),
  
  getAll: (workspaceId, projectId, params) =>
    api.get(`/task/workspace/${workspaceId}/project/${projectId}/all`, { params }),
  
  getById: (taskId, workspaceId) =>
    api.get(`/task/${taskId}/workspace/${workspaceId}`),
  
  update: (taskId, workspaceId, data) =>
    api.put(`/task/${taskId}/workspace/${workspaceId}/update`, data),
  
  updateStatus: (taskId, workspaceId, status) =>
    api.put(`/task/${taskId}/workspace/${workspaceId}/status`, { status }),
  
  updatePriority: (taskId, workspaceId, priority) =>
    api.put(`/task/${taskId}/workspace/${workspaceId}/priority`, { priority }),
  
  assign: (taskId, workspaceId, userId) =>
    api.put(`/task/${taskId}/workspace/${workspaceId}/assign`, { userId }),
  
  delete: (taskId, workspaceId) =>
    api.delete(`/task/${taskId}/workspace/${workspaceId}`),
  
  getMyTasks: (workspaceId, params) =>
    api.get(`/task/workspace/${workspaceId}/my-tasks`, { params }),
  
  getByUser: (userId, workspaceId) =>
    api.get(`/task/user/${userId}/workspace/${workspaceId}`),
  
  getAnalytics: (workspaceId, projectId) =>
    api.get(`/task/workspace/${workspaceId}/project/${projectId}/analytics`)
}

// Member APIs
export const memberAPI = {
  join: (inviteCode) =>
    api.post(`/member/workspace/${inviteCode}/join`),
  
  getAll: (workspaceId) =>
    api.get(`/member/workspace/${workspaceId}/all`),
  
  getCount: (workspaceId) =>
    api.get(`/member/workspace/${workspaceId}/count`),
  
  getById: (memberId, workspaceId) =>
    api.get(`/member/${memberId}/workspace/${workspaceId}`),
  
  addByEmail: (workspaceId, email, role) =>
    api.post(`/member/workspace/${workspaceId}/add`, { email, role }),
  
  updateRole: (memberId, workspaceId, role) =>
    api.put(`/member/${memberId}/workspace/${workspaceId}/role`, { role }),
  
  leave: (workspaceId) =>
    api.post(`/member/workspace/${workspaceId}/leave`),
  
  remove: (memberId, workspaceId) =>
    api.delete(`/member/${memberId}/workspace/${workspaceId}`)
}

// User Profile APIs
export const userAPI = {
  getCurrentUser: () =>
    api.get('/user/current'),
  
  getProfile: () =>
    api.get('/user/profile'),
  
  updateProfile: (data) =>
    api.put('/user/profile', data),
  
  changePassword: (data) =>
    api.put('/user/password', data),
  
  getActivity: (params) =>
    api.get('/user/activity', { params })
}

export default api
