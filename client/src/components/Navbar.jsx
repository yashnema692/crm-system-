import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="container header-content">
                <Link to="/dashboard" className="header-brand">Project Management CRM</Link>
                {user && (
                    <div className="header-user-info">
                        <nav className="header-nav">
                            <Link to="/dashboard">Projects</Link>
                            {user.role === 'ADMIN' && (
                                <Link to="/audit-log">Audit Log</Link>
                            )}
                        </nav>
                        <span>{user.email}</span>
                        <button onClick={handleLogout} className="btn btn-primary">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AppNavbar;