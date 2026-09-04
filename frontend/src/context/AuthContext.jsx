import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        console.log('🔑 Token from localStorage:', token);
        console.log('👤 User Data from localStorage:', userData);
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                console.log('✅ Parsed User:', parsedUser);
                setUser(parsedUser);
                // Set token in axios headers
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log('✅ Token set in axios headers');
            } catch (error) {
                console.error('❌ Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
            console.log('❌ No token or user data found');
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        console.log('🔑 Login called with token:', token);
        console.log('👤 Login user data:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = () => {
        console.log('🚪 Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);