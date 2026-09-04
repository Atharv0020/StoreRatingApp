import React, { useState } from 'react';
import api from '../../services/api';

const UserForm = ({ onSuccess }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', form);
            setForm({ name: '', email: '', password: '', address: '', role: 'user' });
            setError('');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add user');
        }
    };

    return (
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc' }}>
            <h4>Add New User</h4>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <input name="name" placeholder="Name (20-60)" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                <input name="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
                <input name="address" placeholder="Address (max 400)" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} required />
                <select name="role" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="owner">Store Owner</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default UserForm;