import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsDashboard from './pages/ProjectsDashboard';
import AuditLogPage from './pages/AuditLogPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppNavbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app-layout">
      {user && <AppNavbar />}
      <main className="main-content py-4">
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
      <footer className="app-footer">
        <div className="container">
          &copy; {new Date().getFullYear()} - Project CRM managed by Yash Nema.
        </div>
      </footer>
    </div>
  );
}

export default App;
