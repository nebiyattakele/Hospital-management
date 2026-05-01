const express = require('express');
const router = express.Router();
const { registerDoctor, getDoctors } = require('../controllers/doctorController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, admin, registerDoctor)
  .get(getDoctors);

module.exports = router;
