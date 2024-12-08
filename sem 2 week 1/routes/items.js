const express = require('express');
const { check, validationResult } = require('express-validator');
const Item = require('../models/item');
const router = express.Router();

// 16. POST Endpoint: Validate POST Data
router.post(
    '/',
    [
        check('name', 'Name is required').notEmpty(),
        check('name', 'Name must be under 100 characters').isLength({ max: 100 }),
        check('type', 'Type is required').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // 17. Return Validation Errors
        }

        try {
            const { name, type } = req.body;
            const newItem = new Item({ name, type });
            const savedItem = await newItem.save();
            res.status(201).json(savedItem); // 22. Return HTTP Status Codes
        } catch (err) {
            res.status(500).json({ message: 'Error saving item', error: err.message });
        }
    }
);

// GET Endpoint with Pagination and Sorting
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'asc' } = req.query; // 24. Paginate Responses
        const items = await Item.find()
            .sort({ name: sort === 'asc' ? 1 : -1 }) // 25. Sort Responses
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving items', error: err.message });
    }
});

// PUT Endpoint: Update an item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: 'Error updating item', error: err.message });
    }
});

// DELETE Endpoint: Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
});

module.exports = router;
