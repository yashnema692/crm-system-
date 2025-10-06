import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If route is admin-only and user is not an admin, redirect
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />; // Or show an unauthorized page
    }

    return children;
};

export default ProtectedRoute;