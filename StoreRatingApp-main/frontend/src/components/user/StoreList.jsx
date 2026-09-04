import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingForm from './RatingForm';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState({ name: '', address: '' });

    const fetchStores = async () => {
        try {
            const res = await api.get('/stores', { params: search });
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [search]);

    const handleRatingSubmit = async (storeId, rating) => {
        try {
            await api.post(`/stores/${storeId}/ratings`, { rating });
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.error || 'Error submitting rating');
        }
    };

    return (
        <div className="container">
            <h2>Stores</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input placeholder="Search by name" value={search.name} onChange={(e) => setSearch({...search, name: e.target.value})} />
                <input placeholder="Search by address" value={search.address} onChange={(e) => setSearch({...search, address: e.target.value})} />
            </div>
            <table>
                <thead>
                    <tr><th>Name</th><th>Address</th><th>Avg Rating</th><th>Your Rating</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.id}>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td>{store.avg_rating ? Number(store.avg_rating).toFixed(1) : 'No ratings'}</td>
                            <td>{store.user_rating || 'Not rated'}</td>
                            <td>
                                <RatingForm storeId={store.id} currentRating={store.user_rating} onSubmit={handleRatingSubmit} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StoreList;