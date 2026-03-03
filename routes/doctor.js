const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ref, get, push, set } = require('firebase/database');
const auth = require('../middleware/authMiddleware');

// Get all patients (employees) for the doctor to search
router.get('/patients', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied: Doctor only' });
        }

        const employeesRef = ref(db, 'employees');
        const snapshot = await get(employeesRef);
        const employees = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                employees.push({
                    emp_id: data.emp_id,
                    name: data.name,
                    company: data.company_id, // raw ID returned for now
                    hospital: data.partner_hospital,
                    status: data.status,
                    created_at: data.created_at
                });
            });
        }

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

// Get records for all patients (for the timeline)
router.get('/records', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied: Doctor only' });
        }

        const recordsRef = ref(db, 'medical_records');
        const snapshot = await get(recordsRef);
        const records = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                records.push({
                    emp_id: data.worker_id,
                    icd: data.diagnosis,
                    diagnosis: data.notes,
                    plan: data.prescription,
                    type: data.type,
                    created_at: data.date
                });
            });
        }

        records.sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return timeB - timeA;
        });

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

        const recordsRef = ref(db, 'medical_records');
        const newRecordRef = push(recordsRef);

        await set(newRecordRef, {
            worker_id: emp_id || '',
            doctor_id: req.user.id,
            type: type || icd || '',
            diagnosis: icd || '',
            notes: diagnosis || summary || '',
            prescription: plan || '',
            date: new Date().toISOString()
        });

        res.status(201).json({ message: 'Record added successfully', recordId: newRecordRef.key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
