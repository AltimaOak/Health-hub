const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { ref, get, query, orderByChild, equalTo, push, set } = require('firebase/database');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, preferred_language = 'English' } = req.body;

        const usersRef = ref(db, 'users');
        const q = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(q);

        if (snapshot.exists()) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name: name || '',
            email: email || '',
            password_hash: hashedPassword,
            role: role || 'worker',
            phone: phone || '',
            preferred_language: preferred_language || 'English'
        };

        const newUserRef = push(usersRef);
        await set(newUserRef, newUser);

        res.status(201).json({ message: 'User registered successfully', userId: newUserRef.key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usersRef = ref(db, 'users');
        const q = query(usersRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(q);

        if (!snapshot.exists()) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        let userKey = null;
        let user = null;
        snapshot.forEach((childSnapshot) => {
            userKey = childSnapshot.key;
            user = childSnapshot.val();
        });

        user.id = userKey;

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretKey123', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.preferred_language } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
