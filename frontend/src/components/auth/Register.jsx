import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        address: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('========================================');
        console.log('📝 REGISTER BUTTON CLICKED');
        console.log('📤 Sending Registration Data:', form);
        console.log('========================================');

        // Name Validation: 5-20 characters
        if (form.name.length < 5 || form.name.length > 20) {
            setError('Name must be between 5 and 20 characters');
            setLoading(false);
            return;
        }

        // Email Validation
        if (!form.email.includes('@') || !form.email.includes('.')) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Password Validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(form.password)) {
            setError('Password must be 8-16 characters, contain 1 uppercase and 1 special character (!@#$%^&*)');
            setLoading(false);
            return;
        }

        try {
            console.log('🌐 Making API call to: /auth/register');
            const response = await api.post('/auth/register', form);
            
            console.log('✅ Registration Response:', response.data);
            console.log('========================================');
            
            alert('✅ Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('❌ Registration Error:', err);
            console.error('❌ Error Response Data:', err.response?.data);
            console.error('❌ Error Status:', err.response?.status);
            
            const errorMessage = err.response?.data?.error || 
                                err.response?.data?.message || 
                                'Registration failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px' }}>
            <h2>Register</h2>
            
            {error && (
                <div style={{ 
                    background: '#ffebee', 
                    color: '#c62828', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '10px'
                }}>
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Name (5-20 characters)</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                    <small style={{ color: '#666' }}>
                        {form.name.length}/20 characters (min 5)
                    </small>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Password (8-16 characters)</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password: 1 Capital & 1 Special"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                    <small style={{ color: '#666' }}>
                        8-16 chars, 1 uppercase, 1 special character (!@#$%^&*)
                    </small>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Address (max 400 characters)</label>
                    <input
                        name="address"
                        type="text"
                        placeholder="Enter your address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: loading ? '#90a4ae' : '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;