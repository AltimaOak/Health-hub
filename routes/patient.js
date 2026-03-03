const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ref, get, query, orderByChild, equalTo, push, set } = require('firebase/database');

// Get medical records for a worker
router.get('/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;

        const recordsRef = ref(db, 'medical_records');
        const q = query(recordsRef, orderByChild('worker_id'), equalTo(workerId));
        const snapshot = await get(q);

        const records = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                records.push({
                    id: childSnapshot.key,
                    diagnosis: data.diagnosis,
                    prescription: data.prescription,
                    notes: data.notes,
                    date: data.date,
                    // Since this route lacked user info join, we return doctor ID
                    doctor_name: data.doctor_id
                });
            });
        }

        records.sort((a, b) => {
            const timeA = a.date ? new Date(a.date).getTime() : 0;
            const timeB = b.date ? new Date(b.date).getTime() : 0;
            return timeB - timeA;
        });

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

        const recordsRef = ref(db, 'medical_records');
        const newRecordRef = push(recordsRef);

        await set(newRecordRef, {
            worker_id: worker_id || '',
            doctor_id: doctor_id || '',
            diagnosis: diagnosis || '',
            prescription: prescription || '',
            notes: notes || '',
            date: new Date().toISOString()
        });

        res.status(201).json({ message: 'Record added successfully', recordId: newRecordRef.key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
