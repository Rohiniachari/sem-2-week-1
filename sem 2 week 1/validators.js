const { check, validationResult } = require('express-validator');

const validateItem = [
    check('name', 'Name is required').notEmpty(),
    check('name', 'Name must be under 100 characters').isLength({ max: 100 }),
    check('type', 'Type is required').notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateItem };
