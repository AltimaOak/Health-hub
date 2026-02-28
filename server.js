const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const policyRoutes = require('./routes/policy');
const companyRoutes = require('./routes/company');
const doctorRoutes = require('./routes/doctor');
const hospitalRoutes = require('./routes/hospital');

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/hospital', hospitalRoutes);

// Default Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
