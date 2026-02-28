const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Get all doctors for the logged-in hospital
router.get('/doctors', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Access denied: Hospital only' });
        }

        const [doctors] = await db.query(
            'SELECT name, specialization, email, phone, status, license_no as license FROM doctors WHERE hospital_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new doctor
router.post('/doctors', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Access denied: Hospital only' });
        }

        const { doctor_name, specialization, doctor_email, doctor_phone, doctor_status, license_no } = req.body;

        await db.query(
            'INSERT INTO doctors (hospital_id, name, specialization, email, phone, status, license_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, doctor_name, specialization, doctor_email, doctor_phone, doctor_status, license_no]
        );
        res.status(201).json({ message: 'Doctor added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all visits for the logged-in hospital
router.get('/visits', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Access denied: Hospital only' });
        }

        const [visits] = await db.query(
            'SELECT emp_id, emp_name, doctor_name as doctor, DATE_FORMAT(visit_date, "%Y-%m-%d") as date, purpose, status FROM hospital_visits WHERE hospital_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(visits);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new visit record
router.post('/visits', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Access denied: Hospital only' });
        }

        const { visit_emp_id, visit_emp_name, visit_doctor, visit_date, visit_purpose, visit_status } = req.body;

        await db.query(
            'INSERT INTO hospital_visits (hospital_id, emp_id, emp_name, doctor_name, visit_date, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, visit_emp_id, visit_emp_name, visit_doctor, visit_date, visit_purpose, visit_status]
        );
        res.status(201).json({ message: 'Visit logged successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
