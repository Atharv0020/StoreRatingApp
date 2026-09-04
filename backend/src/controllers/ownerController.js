const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const stores = await Store.findByOwner(ownerId);
        if (stores.length === 0) {
            return res.json({ stores: [], message: 'No store registered for this owner.' });
        }

        const store = stores[0];
        const ratings = await Rating.getStoreRatings(store.id);
        res.json({
            store: store,
            avgRating: store.avg_rating || 0,
            ratings: ratings,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};