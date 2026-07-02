import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StoreForm = ({ onSuccess }) => {
    const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/stores', form);
            setForm({ name: '', email: '', address: '', owner_id: '' });
            setError('');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add store');
        }
    };

    return (
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc' }}>
            <h4>Add New Store</h4>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <input name="name" placeholder="Store Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                <input name="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <input name="address" placeholder="Address (max 400)" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} required />
                <select name="owner_id" value={form.owner_id} onChange={(e) => setForm({...form, owner_id: e.target.value})}>
                    <option value="">Select Owner (Optional)</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                </select>
                <button type="submit">Add Store</button>
            </form>
        </div>
    );
};

export default StoreForm;