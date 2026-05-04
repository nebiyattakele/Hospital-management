const doctorUseCase = require('../usecase/doctor/DoctorUseCase');
const adminUseCase = require('../usecase/admin/AdminUseCase');

// @desc    Register a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const registerDoctor = async (req, res) => {
  try {
    const doctor = await adminUseCase.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorUseCase.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorUseCase.getProfile(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res) => {
  try {
    const result = await doctorUseCase.updateProfile(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    await adminUseCase.deleteUser(req.params.id);
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { registerDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor };

