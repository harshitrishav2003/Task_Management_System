
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProjectDetailPage from './components/ProjectDetail';
import AdminLogin from './components/AdminLogin'
import ClientLogin from './components/ClientLogin';
import Dashboard from './components/Dashboard';
import ClientProfile from './components/ClientProfile';
import HomePage from './components/HomePage';
import ContractManagement from './components/ContractManagement';
import ActivityTracking from './components/ActivityTracking';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectPage';
import ClientRegister from './components/ClientRegister';


const App = () => {
  const token = localStorage.getItem('jwtToken'); // Get token from localStorage
  const isAuthenticated = !!token; // Check if the user is authenticated

  const getUserRole = () => {
    if (!token) return null;
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
    return decodedToken.role; // Extract user role
  };

  const role = getUserRole();

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin-login"
          element={ role === 'admin' ? <Navigate to="/dashboard" /> : <AdminLogin />}
        />
        <Route
          path="/client-login"
          element={ role === 'client' ? <Navigate to={`/client/${role.clientId}`} /> : <ClientLogin />}
        />
         <Route
          path="/client-register"
          element={<ClientRegister />} // Add route for registration
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={ role === 'admin' ? <Dashboard /> : <Navigate to="/admin-login" />}
        />
          <Route
          path="/activity-tracking"
          element={
            isAuthenticated && role === "admin" ? (
              <ActivityTracking />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
         <Route
              path="/admin/projects"
              element={
                isAuthenticated && role === "admin" ? (
                  <ProjectsPage />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route
              path="/project/:projectId"
              element={
                isAuthenticated && role === "admin" ? (
                  <ProjectDetailPage />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
         {/* <Route path="/project/:projectId" component={ProjectDetailPage} /> */}
        <Route
          path="/client/:clientId"
          element={isAuthenticated ? <ClientProfile /> : <Navigate to="/client-login" />}
        />
       <Route path="/contract-management/:clientId" element={<ContractManagement />} />
        <Route
          path="/activity-tracking"
          element={isAuthenticated && role === 'client' ? <ActivityTracking /> : <Navigate to="/client-login" />}
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
