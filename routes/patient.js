const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get medical records for a worker
router.get('/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;
        const [records] = await db.query(
            'SELECT m.id, m.diagnosis, m.prescription, m.notes, m.date, d.name as doctor_name FROM medical_records m JOIN users d ON m.doctor_id = d.id WHERE m.worker_id = ? ORDER BY m.date DESC',
            [workerId]
        );
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new medical record (by a doctor)
router.post('/', async (req, res) => {
    try {
        const { worker_id, doctor_id, diagnosis, prescription, notes } = req.body;

        const [result] = await db.query(
            'INSERT INTO medical_records (worker_id, doctor_id, diagnosis, prescription, notes) VALUES (?, ?, ?, ?, ?)',
            [worker_id, doctor_id, diagnosis, prescription, notes]
        );
        res.status(201).json({ message: 'Record added successfully', recordId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
