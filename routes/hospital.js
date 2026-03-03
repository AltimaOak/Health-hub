const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { ref, get, query, orderByChild, equalTo, push, set } = require('firebase/database');
const auth = require('../middleware/authMiddleware');

// Get all doctors for the logged-in hospital
router.get('/doctors', auth, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Access denied: Hospital only' });
        }

        const doctorsRef = ref(db, 'doctors');
        const q = query(doctorsRef, orderByChild('hospital_id'), equalTo(req.user.id));
        const snapshot = await get(q);

        const doctors = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                doctors.push({
                    name: data.name,
                    specialization: data.specialization,
                    email: data.email,
                    phone: data.phone,
                    status: data.status,
                    license: data.license_no,
                    created_at: data.created_at
                });
            });
        }

        doctors.sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return timeB - timeA;
        });

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

        const doctorsRef = ref(db, 'doctors');
        const newDoctorRef = push(doctorsRef);

        await set(newDoctorRef, {
            hospital_id: req.user.id,
            name: doctor_name || '',
            specialization: specialization || '',
            email: doctor_email || '',
            phone: doctor_phone || '',
            status: doctor_status || 'Active',
            license_no: license_no || '',
            created_at: new Date().toISOString()
        });

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

        const visitsRef = ref(db, 'hospital_visits');
        const q = query(visitsRef, orderByChild('hospital_id'), equalTo(req.user.id));
        const snapshot = await get(q);

        const visits = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                // Format date strictly to YYYY-MM-DD for the frontend display if it has time
                let dateStr = data.visit_date;
                if (dateStr && dateStr.includes('T')) {
                    dateStr = dateStr.split('T')[0];
                }
                visits.push({
                    emp_id: data.emp_id,
                    emp_name: data.emp_name,
                    doctor: data.doctor_name,
                    date: dateStr,
                    purpose: data.purpose,
                    status: data.status,
                    created_at: data.created_at
                });
            });
        }

        visits.sort((a, b) => {
            const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return timeB - timeA;
        });

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

        const visitsRef = ref(db, 'hospital_visits');
        const newVisitRef = push(visitsRef);

        await set(newVisitRef, {
            hospital_id: req.user.id,
            emp_id: visit_emp_id || '',
            emp_name: visit_emp_name || '',
            doctor_name: visit_doctor || '',
            visit_date: visit_date || '',
            purpose: visit_purpose || '',
            status: visit_status || 'Active',
            created_at: new Date().toISOString()
        });

        res.status(201).json({ message: 'Visit logged successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
