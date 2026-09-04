import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: '#2c3e50', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>Store Rating App</span>
            <div>
                {user && (
                    <>
                        <span style={{ color: 'white', marginRight: '15px' }}>Welcome, {user.name} ({user.role})</span>
                        <button onClick={handleLogout} style={{ background: '#e74c3c' }}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;