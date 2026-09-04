import React from 'react';

const RatingsList = ({ ratings }) => {
    if (!ratings || ratings.length === 0) {
        return <p>No ratings yet.</p>;
    }

    return (
        <table>
            <thead>
                <tr><th>User</th><th>Rating</th><th>Date</th></tr>
            </thead>
            <tbody>
                {ratings.map(r => (
                    <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.rating}</td>
                        <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RatingsList;