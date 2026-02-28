const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all policies
router.get('/', async (req, res) => {
    try {
        const { state } = req.query;
        let query = 'SELECT * FROM policies';
        let params = [];

        if (state) {
            query += ' WHERE state = ? OR state IS NULL';
            params.push(state);
        }

        const [policies] = await db.query(query, params);
        res.json(policies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
