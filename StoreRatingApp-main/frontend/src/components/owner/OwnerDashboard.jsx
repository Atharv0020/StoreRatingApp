import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OwnerDashboard = () => {
    const [data, setData] = useState({ store: null, avgRating: 0, ratings: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/owner/dashboard');
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (!data.store) return <div className="container">You don't have a store registered yet.</div>;

    return (
        <div className="container">
            <h2>Owner Dashboard</h2>
            <h3>{data.store.name}</h3>
            <p><strong>Average Rating:</strong> {data.avgRating ? Number(data.avgRating).toFixed(1) : 'No ratings yet'}</p>
            <h4>Users who rated your store:</h4>
            <table>
                <thead><tr><th>User</th><th>Rating</th><th>Date</th></tr></thead>
                <tbody>
                    {data.ratings.map(r => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td>{r.rating}</td>
                            <td>{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OwnerDashboard;