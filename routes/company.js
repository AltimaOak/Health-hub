const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ref, get, query, orderByChild, equalTo, push, set } = require('firebase/database');
const auth = require('../middleware/authMiddleware');

// Get all employees for the logged-in company
router.get('/employees', auth, async (req, res) => {
    try {
        if (req.user.role !== 'company') {
            return res.status(403).json({ message: 'Access denied: Company only' });
        }

        const employeesRef = ref(db, 'employees');
        const q = query(employeesRef, orderByChild('company_id'), equalTo(req.user.id));
        const snapshot = await get(q);

        const employees = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                employees.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
        }

        // sort by created_at desc manually
        employees.sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return timeB - timeA;
        });

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

        const employeesRef = ref(db, 'employees');
        const newEmployeeRef = push(employeesRef);

        await set(newEmployeeRef, {
            company_id: req.user.id,
            emp_id: emp_id || '',
            name: name || '',
            department: department || '',
            partner_hospital: partner_hospital || '',
            status: status || 'Active',
            email: email || '',
            phone: phone || '',
            created_at: new Date().toISOString()
        });

        res.status(201).json({ message: 'Employee added successfully', employeeId: newEmployeeRef.key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
