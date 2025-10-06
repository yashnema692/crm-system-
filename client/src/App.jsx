import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsDashboard from './pages/ProjectsDashboard';
import AuditLogPage from './pages/AuditLogPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppNavbar from './components/Navbar';
import { useAuth } from './context/AuthContext'; // Correctly import useAuth

function App() {
  const { user, loading } = useAuth(); // Get the new loading state

  // If we are still checking for a user, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Once loading is false, render the app
  return (
    <>
      {user && <AppNavbar />}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><ProjectsDashboard /></ProtectedRoute>} />
            <Route path="/audit-log" element={<ProtectedRoute adminOnly={true}><AuditLogPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;