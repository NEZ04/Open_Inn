import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import { WorkspaceProvider } from './context/WorkspaceContext'
import { ProjectProvider } from './context/ProjectContext'
import { TaskProvider } from './context/TaskContext'
import ProtectedRoute from './components/ProtectedRoute'
import WorkspaceLayout from './components/WorkspaceLayout'
import WorkspaceHome from './pages/WorkspaceHome'
import ProjectView from './pages/ProjectView'

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ProjectProvider>
          <TaskProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/workspace/:workspaceId" 
                  element={
                    <ProtectedRoute>
                      <WorkspaceLayout>
                        <WorkspaceHome />
                      </WorkspaceLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/workspace/:workspaceId/project/:projectId" 
                  element={
                    <ProtectedRoute>
                      <WorkspaceLayout>
                        <ProjectView />
                      </WorkspaceLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </TaskProvider>
        </ProjectProvider>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

export default App
