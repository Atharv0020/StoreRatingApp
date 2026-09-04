import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('🔥 Dashboard useEffect called!');
        
        const fetchData = async () => {
            try {
                console.log('📊 Fetching data from /admin/stats...');
                const token = localStorage.getItem('token');
                console.log('🔑 Token:', token);
                
                const res = await api.get('/admin/stats');
                console.log('✅ API Response:', res.data);
                setData(res.data);
            } catch (err) {
                console.error('❌ API Error:', err);
                console.error('❌ Error Response:', err.response?.data);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    console.log('🔄 Dashboard rendering...', { loading, data, error });

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>⏳ Loading Dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: 'red' }}>❌ Error: {error}</h2>
                <p>Check console for more details.</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>📊 No Data</h2>
                <p>No data received from API.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px' }}>
            <h2>📊 Admin Dashboard</h2>
            <p>Data received: {JSON.stringify(data)}</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                <div style={{ padding: '25px', background: '#3498db', color: 'white', borderRadius: '10px', flex: 1, minWidth: '150px', textAlign: 'center' }}>
                    <h3>👥 Total Users</h3>
                    <p style={{ fontSize: '2.5em' }}>{data.totalUsers || 0}</p>
                </div>
                <div style={{ padding: '25px', background: '#2ecc71', color: 'white', borderRadius: '10px', flex: 1, minWidth: '150px', textAlign: 'center' }}>
                    <h3>🏪 Total Stores</h3>
                    <p style={{ fontSize: '2.5em' }}>{data.totalStores || 0}</p>
                </div>
                <div style={{ padding: '25px', background: '#e67e22', color: 'white', borderRadius: '10px', flex: 1, minWidth: '150px', textAlign: 'center' }}>
                    <h3>⭐ Total Ratings</h3>
                    <p style={{ fontSize: '2.5em' }}>{data.totalRatings || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;