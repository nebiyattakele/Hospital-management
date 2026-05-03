const dashboardUseCase = require('../usecase/dashboard/DashboardUseCase');

// @desc    Get patient dashboard data
// @route   GET /api/dashboard/patient
// @access  Private (Patient)
const getPatientDashboardData = async (req, res) => {
  try {
    const data = await dashboardUseCase.getPatientDashboardData(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminDashboardData = async (req, res) => {
  try {
    const data = await dashboardUseCase.getAdminDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor dashboard data
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
const getDoctorDashboardData = async (req, res) => {
  try {
    const data = await dashboardUseCase.getDoctorDashboardData(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatientDashboardData, getAdminDashboardData, getDoctorDashboardData };

