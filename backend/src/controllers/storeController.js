const Store = require('../models/Store');
const Rating = require('../models/Rating');

exports.listStores = async (req, res) => {
    try {
        const { name, address, sort, order } = req.query;
        const stores = await Store.list({
            filters: { name, address },
            sort: sort || 'name',
            order: order || 'ASC',
            page: 1,
            limit: 100
        });

        const userId = req.user.id;
        for (let store of stores) {
            const userRating = await Rating.findUserRating(userId, store.id);
            store.user_rating = userRating ? userRating.rating : null;
        }
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        await Rating.create(userId, storeId, rating);
        res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};