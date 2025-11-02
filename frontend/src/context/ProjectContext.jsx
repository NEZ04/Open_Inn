import React, { createContext, useContext, useState } from 'react';
import { projectAPI } from '../services/api';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all projects in workspace
  const fetchProjects = async (workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.getAll(workspaceId);
      setProjects(response.data.projects || []);
      return response.data.projects;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch project by ID
  const fetchProjectById = async (projectId, workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.getById(projectId, workspaceId);
      setCurrentProject(response.data.project);
      return response.data.project;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project');
      console.error('Error fetching project:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (workspaceId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.create(workspaceId, data);
      const newProject = response.data.project;
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (projectId, workspaceId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.update(projectId, workspaceId, data);
      const updatedProject = response.data.project;
      
      setProjects(prev => 
        prev.map(p => p._id === projectId ? updatedProject : p)
      );
      
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      return updatedProject;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId, workspaceId) => {
    try {
      setLoading(true);
      setError(null);
      await projectAPI.delete(projectId, workspaceId);
      
      setProjects(prev => prev.filter(p => p._id !== projectId));
      
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get project analytics
  const getProjectAnalytics = async (projectId, workspaceId) => {
    try {
      const response = await projectAPI.getAnalytics(projectId, workspaceId);
      return response.data;
    } catch (err) {
      console.error('Error fetching project analytics:', err);
      throw err;
    }
  };

  const value = {
    projects,
    currentProject,
    loading,
    error,
    setCurrentProject,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectAnalytics
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
