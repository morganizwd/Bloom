import FavoriteModel from '../models/favorite.js';

export const add = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let favorite = await FavoriteModel.findOne({ user: userId });
        
        if (favorite) {
            // Add the product to the existing favorite list
            favorite.products.push(productId);
            await favorite.save();
        } else {
            // Create a new favorite list for the user
            favorite = new FavoriteModel({
                user: userId,
                products: [productId],
            });
            await favorite.save();
        }

        res.status(200).json(favorite);
    } catch (err) {
        res.status(500).json({ message: 'Error adding to favorites', error: err });
    }
};

// Remove a product from favorites
export const remove = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find the favorite list and remove the product
        const favorite = await FavoriteModel.findOne({ user: userId });
        if (favorite) {
            favorite.products.pull(productId); // mongoose method to remove an item from an array
            await favorite.save();
            res.status(200).json(favorite);
        } else {
            res.status(404).json({ message: 'Favorites not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error removing from favorites', error: err });
    }
};

// Get all favorite products for a user
export const get = async (req, res) => {
    try {
        const userId = req.params.userId;

        const favorites = await FavoriteModel.findOne({ user: userId })
                           .populate('products'); // Populates product details

        if (favorites) {
            res.status(200).json(favorites.products);
        } else {
            res.status(404).json({ message: 'No favorites found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites', error: err });
    }
}; 