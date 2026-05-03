const express = require('express');
const router = express.Router();
const { getPatientDashboardData, getAdminDashboardData, getDoctorDashboardData } = require('../controllers/dashboardController');
const { protect, patient, admin, doctor } = require('../middlewares/authMiddleware');

router.get('/patient', protect, patient, getPatientDashboardData);
router.get('/admin', protect, admin, getAdminDashboardData);
router.get('/doctor', protect, doctor, getDoctorDashboardData);

module.exports = router;
