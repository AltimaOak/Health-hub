const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ref, get, query, orderByChild, equalTo } = require('firebase/database');

// Get all policies
router.get('/', async (req, res) => {
    try {
        const { state } = req.query;
        const policiesRef = ref(db, 'policies');
        let snapshot;

        if (state) {
            // Filter by state if provided
            const q = query(policiesRef, orderByChild('state'), equalTo(state));
            snapshot = await get(q);
        } else {
            snapshot = await get(policiesRef);
        }

        const policies = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                policies.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
        }

        res.json(policies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
