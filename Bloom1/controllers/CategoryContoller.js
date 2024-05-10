import CategoryModel from '../models/category.js';

export const create = async (req, res) => {
    try {
        const category = new CategoryModel({
            Name: req.body.name
        });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const category = await CategoryModel.findByIdAndUpdate(
            req.params.id,
            { Name: req.body.name },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const remove = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await CategoryModel.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};