import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingForm from './RatingForm';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState({ name: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStores = async () => {
        try {
            setLoading(true);
            console.log('🏪 Fetching stores...');
            const res = await api.get('/stores', { params: search });
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
    }, [search]);

    const handleRatingSubmit = async (storeId, rating) => {
        try {
            console.log('⭐ Submitting rating:', { storeId, rating });
            const res = await api.post(`/stores/${storeId}/ratings`, { rating });
            console.log('✅ Rating submitted:', res.data);
            alert('✅ Rating submitted successfully!');
            fetchStores();
        } catch (err) {
            console.error('❌ Error submitting rating:', err);
            alert(err.response?.data?.error || 'Error submitting rating');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <h2>🏪 Stores</h2>
                <p>Loading stores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <h2>🏪 Stores</h2>
                <p style={{ color: 'red' }}>❌ Error: {error}</p>
                <button onClick={fetchStores} style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    🔄 Retry
                </button>
            </div>
        );
    }

    if (stores.length === 0) {
        return (
            <div className="container">
                <h2>🏪 Stores</h2>
                <p>No stores available. Please check back later.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>🏪 Stores</h2>
            <p style={{ color: '#666' }}>Rate stores from 1 to 5 stars. You can update your rating anytime.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    placeholder="Search by name" 
                    value={search.name} 
                    onChange={(e) => setSearch({...search, name: e.target.value})}
                    style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ddd' }}
                />
                <input 
                    placeholder="Search by address" 
                    value={search.address} 
                    onChange={(e) => setSearch({...search, address: e.target.value})}
                    style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ddd' }}
                />
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Avg Rating</th>
                        <th>Your Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store, index) => (
                        <tr key={store.id}>
                            <td>{index + 1}</td>
                            <td><strong>{store.name}</strong></td>
                            <td>{store.address}</td>
                            <td>
                                {store.avg_rating ? (
                                    <span style={{ color: '#f39c12', fontWeight: 'bold' }}>
                                        ⭐ {Number(store.avg_rating).toFixed(1)}
                                    </span>
                                ) : (
                                    <span style={{ color: '#999' }}>No ratings</span>
                                )}
                            </td>
                            <td>
                                {store.user_rating ? (
                                    <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                                        ⭐ {store.user_rating}
                                    </span>
                                ) : (
                                    <span style={{ color: '#999' }}>Not rated</span>
                                )}
                            </td>
                            <td>
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

export default StoreList;