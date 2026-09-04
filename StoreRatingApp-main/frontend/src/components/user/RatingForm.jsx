import React, { useState } from 'react';

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

export default RatingForm;