const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Get all patients (employees) for the doctor to search
router.get('/patients', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied: Doctor only' });
        }

        const [employees] = await db.query(
            'SELECT e.emp_id, e.name, u.name as company, e.partner_hospital as hospital, e.status ' +
            'FROM employees e JOIN users u ON e.company_id = u.id ORDER BY e.created_at DESC'
        );
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get records for all patients (for the timeline)
router.get('/records', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied: Doctor only' });
        }

        const [records] = await db.query(
            'SELECT worker_id as emp_id, diagnosis as icd, notes as diagnosis, prescription as plan, ' +
            'diagnosis as type, date as created_at FROM medical_records ORDER BY date DESC'
        );
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new medical record
router.post('/records', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied: Doctor only' });
        }

        const { emp_id, icd, diagnosis, plan, type, summary } = req.body;

        // For the hackathon demo, we are mapping the frontend fields into the simpler medical_records schema
        // worker_id = emp_id (varchar now), diagnosis = icd, notes = diagnosis, prescription = plan
        const [result] = await db.query(
            'INSERT INTO medical_records (worker_id, doctor_id, diagnosis, notes, prescription) VALUES (?, ?, ?, ?, ?)',
            [emp_id, req.user.id, type, diagnosis || summary, plan]
        );
        res.status(201).json({ message: 'Record added successfully', recordId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
