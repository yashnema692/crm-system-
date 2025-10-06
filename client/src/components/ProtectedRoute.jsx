import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If the route is for admins only and the user is not an admin, redirect them
    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/user-dashboard" />;
    }

    return children;
};

export default ProtectedRoute;

