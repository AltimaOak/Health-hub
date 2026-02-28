const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Get all employees for the logged-in company
router.get('/employees', auth, async (req, res) => {
    try {
        if (req.user.role !== 'company') {
            return res.status(403).json({ message: 'Access denied: Company only' });
        }

        const [employees] = await db.query(
            'SELECT * FROM employees WHERE company_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new employee for the company
router.post('/employees', auth, async (req, res) => {
    try {
        if (req.user.role !== 'company') {
            return res.status(403).json({ message: 'Access denied: Company only' });
        }

        const { emp_id, name, department, partner_hospital, status, email, phone } = req.body;

        const [result] = await db.query(
            'INSERT INTO employees (company_id, emp_id, name, department, partner_hospital, status, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, emp_id, name, department, partner_hospital, status || 'Active', email, phone]
        );
        res.status(201).json({ message: 'Employee added successfully', employeeId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
