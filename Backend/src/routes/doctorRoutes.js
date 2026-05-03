const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, admin, registerDoctor)
  .get(getDoctors);

router.route('/:id')
  .get(getDoctorById)
  .put(protect, admin, updateDoctor)
  .delete(protect, admin, deleteDoctor);

module.exports = router;
