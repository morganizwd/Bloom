import PromotionModel from '../models/promotions.js';

export const create = async (req, res) => {
    try {
        const doc = new PromotionModel({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        });

        const promotions = await doc.save();

        res.json(promotions);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const update = async (req, res) => {
    try {
        const promotionsId = req.params.id;

        await PromotionModel.updateOne(
            {
                _id: promotionsId,
            },
            {
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Update attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const promotionsId = req.params.id;
        const promotions = await PromotionModel.findByIdAndDelete(promotionsId);

        if (!promotions) {
            return res.status(404).json({ message: 'promotions not found' });
        }

        res.json({ message: 'promotions successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Delete attempt failed' });
    }
};

export const getOne = async (req, res) => {
    try {
        const promotionsId = req.params.id;

        const doc = await PromotionModel.findById(promotionsId);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Prodcuct not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Search attempt failed',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const promotionss = await PromotionModel.find();

        res.json(promotionss);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve promotionss',
        });
    }
};