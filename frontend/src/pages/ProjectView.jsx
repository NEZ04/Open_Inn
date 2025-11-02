import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useTask } from '../context/TaskContext';
import { memberAPI } from '../services/api';

const ProjectView = () => {
  const { workspaceId, projectId } = useParams();
  const { currentProject, fetchProjectById } = useProject();
  const {
    tasks,
    fetchTasks,
    createTask,
    updateTaskStatus,
    updateTaskPriority,
    assignTask,
    deleteTask
  } = useTask();

  const [members, setMembers] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (workspaceId && projectId) {
      loadData();
    }
  }, [workspaceId, projectId]);

  const loadData = async () => {
    try {
      await fetchProjectById(projectId, workspaceId);
      await fetchTasks(workspaceId, projectId);
      
      const membersData = await memberAPI.getAll(workspaceId);
      setMembers(membersData.data.members || []);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(workspaceId, projectId, newTask);
      setShowCreateTask(false);
      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
      await fetchTasks(workspaceId, projectId);
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, workspaceId, newStatus);
      await fetchTasks(workspaceId, projectId);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await updateTaskPriority(taskId, workspaceId, newPriority);
      await fetchTasks(workspaceId, projectId);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      await assignTask(taskId, workspaceId, userId);
      await fetchTasks(workspaceId, projectId);
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId, workspaceId);
        await fetchTasks(workspaceId, projectId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TaskCard = ({ task }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono text-gray-500">{task.taskCode}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="text-gray-400 hover:text-red-600 ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {task.assignedTo ? (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <select
              onChange={(e) => handleAssignTask(task._id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Assign...</option>
              {members.map((member) => (
                <option key={member._id} value={member.user._id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => handleStatusChange(task._id, e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {task.dueDate && (
        <div className="mt-2 text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{currentProject?.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentProject?.name}</h1>
              <p className="text-gray-600">{currentProject?.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateTask(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Task</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{tasks.length}</span> total tasks
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-blue-600">{todoTasks.length}</span> to do
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-yellow-600">{inProgressTasks.length}</span> in progress
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-green-600">{doneTasks.length}</span> done
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">To Do</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {todoTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No tasks</p>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">In Progress</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No tasks</p>
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Done</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {doneTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
            {doneTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add more details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
