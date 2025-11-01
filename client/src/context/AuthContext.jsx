import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error("Failed to parse user info", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('https://crm-system-16lm.onrender.com/api/auth/login', { email, password });
        
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };
    
    const signup = async (email, password, role) => {
        const { data } = await axios.post('https://crm-system-16lm.onrender.com/api/auth/signup', { email, password, role });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
