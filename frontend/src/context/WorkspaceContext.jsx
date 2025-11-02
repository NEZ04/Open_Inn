import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceAPI } from '../services/api';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workspaceAPI.getAll();
      setWorkspaces(response.data.workspaces || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch workspaces');
      console.error('Error fetching workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch workspace by ID
  const fetchWorkspaceById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workspaceAPI.getById(id);
      setCurrentWorkspace(response.data.workspace);
      return response.data.workspace;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch workspace');
      console.error('Error fetching workspace:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create workspace
  const createWorkspace = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workspaceAPI.create(data);
      const newWorkspace = response.data.workspace;
      setWorkspaces(prev => [...prev, newWorkspace]);
      return newWorkspace;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update workspace
  const updateWorkspace = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workspaceAPI.update(id, data);
      const updatedWorkspace = response.data.workspace;
      
      setWorkspaces(prev => 
        prev.map(ws => ws._id === id ? updatedWorkspace : ws)
      );
      
      if (currentWorkspace?._id === id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      
      return updatedWorkspace;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete workspace
  const deleteWorkspace = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await workspaceAPI.delete(id);
      
      setWorkspaces(prev => prev.filter(ws => ws._id !== id));
      
      if (currentWorkspace?._id === id) {
        setCurrentWorkspace(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get workspace analytics
  const getWorkspaceAnalytics = async (id) => {
    try {
      const response = await workspaceAPI.getAnalytics(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching analytics:', err);
      throw err;
    }
  };

  // Get workspace members
  const getWorkspaceMembers = async (id) => {
    try {
      const response = await workspaceAPI.getMembers(id);
      return response.data.members;
    } catch (err) {
      console.error('Error fetching members:', err);
      throw err;
    }
  };

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    setCurrentWorkspace,
    fetchWorkspaces,
    fetchWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspaceAnalytics,
    getWorkspaceMembers
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
