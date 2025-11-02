import React, { createContext, useContext, useState } from 'react';
import { taskAPI } from '../services/api';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks in project
  const fetchTasks = async (workspaceId, projectId, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getAll(workspaceId, projectId, filters);
      setTasks(response.data.tasks || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
      return { tasks: [], pagination: null };
    } finally {
      setLoading(false);
    }
  };

  // Fetch my tasks
  const fetchMyTasks = async (workspaceId, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getMyTasks(workspaceId, filters);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch my tasks');
      console.error('Error fetching my tasks:', err);
      return { tasks: [] };
    } finally {
      setLoading(false);
    }
  };

  // Fetch task by ID
  const fetchTaskById = async (taskId, workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getById(taskId, workspaceId);
      setCurrentTask(response.data.task);
      return response.data.task;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task');
      console.error('Error fetching task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async (workspaceId, projectId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.create(workspaceId, projectId, data);
      const newTask = response.data.task;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const updateTask = async (taskId, workspaceId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.update(taskId, workspaceId, data);
      const updatedTask = response.data.task;
      
      setTasks(prev => 
        prev.map(t => t._id === taskId ? updatedTask : t)
      );
      
      if (currentTask?._id === taskId) {
        setCurrentTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, workspaceId, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.updateStatus(taskId, workspaceId, status);
      const updatedTask = response.data.task;
      
      setTasks(prev => 
        prev.map(t => t._id === taskId ? updatedTask : t)
      );
      
      if (currentTask?._id === taskId) {
        setCurrentTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update task priority
  const updateTaskPriority = async (taskId, workspaceId, priority) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.updatePriority(taskId, workspaceId, priority);
      const updatedTask = response.data.task;
      
      setTasks(prev => 
        prev.map(t => t._id === taskId ? updatedTask : t)
      );
      
      if (currentTask?._id === taskId) {
        setCurrentTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task priority');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assign task
  const assignTask = async (taskId, workspaceId, userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.assign(taskId, workspaceId, userId);
      const updatedTask = response.data.task;
      
      setTasks(prev => 
        prev.map(t => t._id === taskId ? updatedTask : t)
      );
      
      if (currentTask?._id === taskId) {
        setCurrentTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId, workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      await taskAPI.delete(taskId, workspaceId);
      
      setTasks(prev => prev.filter(t => t._id !== taskId));
      
      if (currentTask?._id === taskId) {
        setCurrentTask(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get task analytics
  const getTaskAnalytics = async (workspaceId, projectId) => {
    try {
      const response = await taskAPI.getAnalytics(workspaceId, projectId);
      return response.data;
    } catch (err) {
      console.error('Error fetching task analytics:', err);
      throw err;
    }
  };

  const value = {
    tasks,
    currentTask,
    loading,
    error,
    setCurrentTask,
    fetchTasks,
    fetchMyTasks,
    fetchTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    updateTaskPriority,
    assignTask,
    deleteTask,
    getTaskAnalytics
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
