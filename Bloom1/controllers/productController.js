import ProductModel from '../models/product.js';

export const create = async (req, res) => {
    try {
        const doc = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            categories: req.body.categories,
        });

        const product = await doc.save();

        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const update = async (req, res) => {
    try {
        const productId = req.params.id;

        await ProductModel.updateOne(
            {
                _id: productId,
            },
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                categories: req.body.categories,
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
        const productId = req.params.id;
        const product = await ProductModel.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Delete attempt failed' });
    }
};

export const getOne = async (req, res) => {
    try {
        const productId = req.params.id;

        const doc = await ProductModel.findById(productId);

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
        const products = await ProductModel.find();

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve products',
        });
    }
};

export const getByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await ProductModel.find({ categories: categoryId });

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error retrieving products by category',
        });
    }
};