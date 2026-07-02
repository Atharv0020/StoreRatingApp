import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users', { params: { ...filters, sort: sort.field, order: sort.order } });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters, sort]);

    const handleSort = (field) => {
        const order = sort.field === field && sort.order === 'ASC' ? 'DESC' : 'ASC';
        setSort({ field, order });
    };

    return (
        <div className="container">
            <h2>All Users</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} />
                <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({...filters, email: e.target.value})} />
                <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({...filters, address: e.target.value})} />
                <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Name {sort.field === 'name' && (sort.order === 'ASC' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('email')}>Email {sort.field === 'email' && (sort.order === 'ASC' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('address')}>Address {sort.field === 'address' && (sort.order === 'ASC' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('role')}>Role {sort.field === 'role' && (sort.order === 'ASC' ? '↑' : '↓')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.address}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;