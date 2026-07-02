import React, { useState, useEffect } from 'react';
import api from './services/api';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('Test@1234');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState('dashboard');

    // ============ Check if user is already logged in ============
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role === 'admin') {
                fetchStats(token);
            }
        }
        setLoading(false);
    }, []);

    // ============ Fetch dashboard stats ============
    const fetchStats = async (token) => {
        try {
            console.log('📊 Fetching dashboard stats...');
            const res = await api.get('/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('📊 Stats Response:', res.data);
            setStats({
                totalUsers: res.data.totalUsers || 0,
                totalStores: res.data.totalStores || 0,
                totalRatings: res.data.totalRatings || 0
            });
        } catch (err) {
            console.error('❌ Error fetching stats:', err);
        }
    };

    // ============ Handle Login ============
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            console.log('🔑 Login Attempt:', { email });
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;
            console.log('✅ Login Success:', user);
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            if (user.role === 'admin') {
                fetchStats(token);
            }
            setCurrentPage('dashboard');
        } catch (err) {
            console.error('❌ Login Error:', err.response?.data);
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    // ============ Handle Register ============
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (name.length < 5 || name.length > 20) {
            setError('Name must be between 5 and 20 characters');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            return;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(password)) {
            setError('Password must be 8-16 characters, contain 1 uppercase and 1 special character (!@#$%^&*)');
            return;
        }
        if (address.length > 400) {
            setError('Address cannot exceed 400 characters');
            return;
        }

        try {
            console.log('📝 Register Attempt:', { name, email, address });
            const res = await api.post('/auth/register', { name, email, password, address });
            console.log('✅ Register Success:', res.data);
            setSuccess('✅ Registration successful! Please login.');
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setIsLogin(true);
        } catch (err) {
            console.error('❌ Register Error:', err.response?.data);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    // ============ Handle Logout ============
    const handleLogout = () => {
        console.log('🚪 Logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setStats({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
        setCurrentPage('dashboard');
    };

    // ============ Render Page ============
    const renderPage = () => {
        if (!user) return null;

        // Admin Pages
        if (user.role === 'admin') {
            if (currentPage === 'dashboard') {
                return renderAdminDashboard();
            } else if (currentPage === 'users') {
                return <div style={{ padding: '30px', color: 'white' }}><h2>👥 Manage Users</h2><p>User list will appear here.</p></div>;
            } else if (currentPage === 'stores') {
                return <div style={{ padding: '30px', color: 'white' }}><h2>🏪 Manage Stores</h2><p>Store list will appear here.</p></div>;
            } else if (currentPage === 'view-stores') {
                return <StoreList />;
            }
        }

        // User Pages
        if (user.role === 'user') {
            if (currentPage === 'dashboard') {
                return renderUserDashboard();
            } else if (currentPage === 'stores') {
                return <StoreList />;
            }
        }

        // Owner Pages
        if (user.role === 'owner') {
            if (currentPage === 'dashboard') {
                return renderOwnerDashboard();
            }
        }

        return null;
    };

    // ============ Render Navbar ============
    const renderNavbar = () => {
        if (!user) return null;

        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '15px 30px', 
                background: '#2c3e50',
                borderBottom: '2px solid #3498db'
            }}>
                <h1 style={{ color: '#3498db', fontSize: '24px', cursor: 'pointer' }} 
                    onClick={() => setCurrentPage('dashboard')}>
                    📊 Store Rating App
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Navigation Links */}
                    {user.role === 'admin' && (
                        <>
                            <button onClick={() => setCurrentPage('dashboard')} style={navButtonStyle}>📊 Dashboard</button>
                            <button onClick={() => setCurrentPage('users')} style={navButtonStyle}>👥 Users</button>
                            <button onClick={() => setCurrentPage('stores')} style={navButtonStyle}>🏪 Stores</button>
                            <button onClick={() => setCurrentPage('view-stores')} style={navButtonStyle}>📋 View Stores</button>
                        </>
                    )}
                    {user.role === 'user' && (
                        <>
                            <button onClick={() => setCurrentPage('dashboard')} style={navButtonStyle}>🏠 Home</button>
                            <button onClick={() => setCurrentPage('stores')} style={navButtonStyle}>📋 Stores</button>
                        </>
                    )}
                    {user.role === 'owner' && (
                        <>
                            <button onClick={() => setCurrentPage('dashboard')} style={navButtonStyle}>🏠 Home</button>
                        </>
                    )}
                    
                    <span style={{ color: '#ecf0f1' }}>👤 {user.name} ({user.role})</span>
                    <button onClick={handleLogout} style={{ 
                        padding: '8px 20px', 
                        background: '#e74c3c', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}>Logout</button>
                </div>
            </div>
        );
    };

    const navButtonStyle = {
        padding: '8px 15px',
        background: 'transparent',
        color: '#ecf0f1',
        border: '1px solid #ecf0f1',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    // ============ Render User Dashboard ============
    const renderUserDashboard = () => {
        return (
            <div style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ color: '#ecf0f1' }}>🏪 Welcome to Store Rating App!</h2>
                <p style={{ color: '#bdc3c7', fontSize: '18px' }}>You are logged in as a <strong style={{ color: '#2ecc71' }}>Normal User</strong></p>
                <p style={{ color: '#bdc3c7' }}>You can view all stores and submit ratings.</p>
                <div style={{ marginTop: '30px' }}>
                    <button 
                        onClick={() => setCurrentPage('stores')}
                        style={{ 
                            padding: '14px 50px', 
                            background: '#2ecc71', 
                            color: 'white', 
                            borderRadius: '5px', 
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}
                    >
                        📋 View Stores & Rate
                    </button>
                </div>
            </div>
        );
    };

    // ============ Render Admin Dashboard ============
    const renderAdminDashboard = () => {
        return (
            <div style={{ padding: '30px' }}>
                <h2 style={{ color: '#ecf0f1' }}>📊 Admin Dashboard</h2>
                <p style={{ color: '#bdc3c7' }}>Welcome to the admin dashboard! Here's an overview of your platform.</p>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '25px', background: 'linear-gradient(135deg, #3498db, #2980b9)', borderRadius: '10px', flex: 1, minWidth: '180px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '16px', opacity: 0.9 }}>👥 Total Users</h3>
                        <p style={{ fontSize: '3em', margin: '10px 0', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                    </div>
                    <div style={{ padding: '25px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)', borderRadius: '10px', flex: 1, minWidth: '180px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '16px', opacity: 0.9 }}>🏪 Total Stores</h3>
                        <p style={{ fontSize: '3em', margin: '10px 0', fontWeight: 'bold' }}>{stats.totalStores}</p>
                    </div>
                    <div style={{ padding: '25px', background: 'linear-gradient(135deg, #e67e22, #d35400)', borderRadius: '10px', flex: 1, minWidth: '180px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '16px', opacity: 0.9 }}>⭐ Total Ratings</h3>
                        <p style={{ fontSize: '3em', margin: '10px 0', fontWeight: 'bold' }}>{stats.totalRatings}</p>
                    </div>
                </div>
                
                <div style={{ marginTop: '30px', padding: '25px', background: '#2c3e50', borderRadius: '10px' }}>
                    <h4 style={{ color: '#ecf0f1' }}>🚀 Quick Actions</h4>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
                        <button onClick={() => setCurrentPage('users')} style={{ padding: '12px 30px', background: '#3498db', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>👥 Manage Users</button>
                        <button onClick={() => setCurrentPage('stores')} style={{ padding: '12px 30px', background: '#2ecc71', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🏪 Manage Stores</button>
                        <button onClick={() => setCurrentPage('view-stores')} style={{ padding: '12px 30px', background: '#e67e22', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📋 View Stores</button>
                    </div>
                </div>
            </div>
        );
    };

    // ============ Render Owner Dashboard ============
    const renderOwnerDashboard = () => {
        return (
            <div style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ color: '#ecf0f1' }}>🏪 Store Owner Dashboard</h2>
                <p style={{ color: '#bdc3c7', fontSize: '18px' }}>You are logged in as a <strong style={{ color: '#f39c12' }}>Store Owner</strong></p>
                <p style={{ color: '#bdc3c7' }}>View ratings given to your store.</p>
            </div>
        );
    };

    // ============ StoreList Component ============
    const StoreList = () => {
        const [stores, setStores] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const fetchStores = async () => {
            try {
                setLoading(true);
                console.log('🏪 Fetching stores...');
                const res = await api.get('/stores');
                console.log('🏪 Stores Response:', res.data);
                setStores(res.data);
                setError(null);
            } catch (err) {
                console.error('❌ Error fetching stores:', err);
                setError(err.response?.data?.error || 'Failed to fetch stores');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchStores();
        }, []);

        const handleRatingSubmit = async (storeId, rating) => {
            try {
                console.log('⭐ Submitting rating:', { storeId, rating });
                await api.post(`/stores/${storeId}/ratings`, { rating });
                alert('✅ Rating submitted successfully!');
                fetchStores();
            } catch (err) {
                console.error('❌ Error submitting rating:', err);
                alert(err.response?.data?.error || 'Error submitting rating');
            }
        };

        const RatingForm = ({ storeId, currentRating, onSubmit }) => {
            const [rating, setRating] = useState(currentRating || 0);
            const [loading, setLoading] = useState(false);

            const handleSubmit = async (e) => {
                e.preventDefault();
                if (rating < 1 || rating > 5) {
                    alert('⚠️ Rating must be between 1 and 5');
                    return;
                }
                setLoading(true);
                try {
                    await onSubmit(storeId, rating);
                } catch (err) {
                    console.error('Error:', err);
                } finally {
                    setLoading(false);
                }
            };

            return (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        style={{ 
                            width: '65px', 
                            padding: '8px', 
                            borderRadius: '5px', 
                            border: '1px solid #ddd',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}
                        placeholder="1-5"
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '8px 20px',
                            background: currentRating ? '#f39c12' : '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                    >
                        {loading ? '...' : (currentRating ? 'Update' : 'Submit')}
                    </button>
                </form>
            );
        };

        if (loading) {
            return (
                <div style={{ padding: '30px' }}>
                    <h2 style={{ color: '#ecf0f1' }}>🏪 Stores</h2>
                    <p style={{ color: '#bdc3c7' }}>Loading stores...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '30px' }}>
                    <h2 style={{ color: '#ecf0f1' }}>🏪 Stores</h2>
                    <p style={{ color: 'red' }}>❌ Error: {error}</p>
                    <button onClick={fetchStores} style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        🔄 Retry
                    </button>
                </div>
            );
        }

        if (stores.length === 0) {
            return (
                <div style={{ padding: '30px' }}>
                    <h2 style={{ color: '#ecf0f1' }}>🏪 Stores</h2>
                    <p style={{ color: '#bdc3c7' }}>No stores available. Please check back later.</p>
                    <button onClick={fetchStores} style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        🔄 Refresh
                    </button>
                </div>
            );
        }

        return (
            <div style={{ padding: '30px' }}>
                <h2 style={{ color: '#ecf0f1' }}>🏪 Stores</h2>
                <p style={{ color: '#bdc3c7' }}>Rate stores from 1 to 5 stars. You can update your rating anytime.</p>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#2c3e50' }}>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>#</th>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>Name</th>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>Address</th>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>Avg Rating</th>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>Your Rating</th>
                            <th style={{ padding: '12px', border: '1px solid #444', color: '#ecf0f1' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store, index) => (
                            <tr key={store.id} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '12px', color: '#bdc3c7' }}>{index + 1}</td>
                                <td style={{ padding: '12px', color: '#ecf0f1' }}><strong>{store.name}</strong></td>
                                <td style={{ padding: '12px', color: '#bdc3c7' }}>{store.address}</td>
                                <td style={{ padding: '12px', color: '#bdc3c7' }}>
                                    {store.avg_rating ? (
                                        <span style={{ color: '#f39c12', fontWeight: 'bold' }}>
                                            ⭐ {Number(store.avg_rating).toFixed(1)}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#999' }}>No ratings</span>
                                    )}
                                </td>
                                <td style={{ padding: '12px', color: '#bdc3c7' }}>
                                    {store.user_rating ? (
                                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                                            ⭐ {store.user_rating}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#999' }}>Not rated</span>
                                    )}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <RatingForm 
                                        storeId={store.id} 
                                        currentRating={store.user_rating} 
                                        onSubmit={handleRatingSubmit} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // ============ Loading ============
    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>⏳ Loading...</div>;
    }

    // ============ Login / Register Page ============
    if (!user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: '#2c3e50'
            }}>
                <div style={{ 
                    maxWidth: '450px', 
                    width: '100%',
                    padding: '40px', 
                    background: 'white', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>
                        {isLogin ? '🔐 Login' : '📝 Register'}
                    </h2>
                    
                    {error && (
                        <div style={{ 
                            background: '#ffebee', 
                            color: '#c62828', 
                            padding: '10px', 
                            borderRadius: '5px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            ❌ {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ 
                            background: '#e8f5e9', 
                            color: '#2e7d32', 
                            padding: '10px', 
                            borderRadius: '5px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            ✅ {success}
                        </div>
                    )}

                    {isLogin ? (
                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <button 
                                type="submit" 
                                style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name (5-20 characters)</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password (8-16 characters)</label>
                                <input 
                                    type="password" 
                                    placeholder="Password: 1 Capital & 1 Special" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address (max 400 characters)</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }} 
                                    required 
                                />
                            </div>
                            <button 
                                type="submit" 
                                style={{ width: '100%', padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Register
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                        {isLogin ? (
                            <>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Register</button></>
                        ) : (
                            <>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Login</button></>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    // ============ Main App ============
    return (
        <div style={{ background: '#1a1a2e', minHeight: '100vh' }}>
            {renderNavbar()}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {renderPage()}
            </div>
        </div>
    );
}

export default App;