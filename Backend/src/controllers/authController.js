const authUseCase = require('../usecase/auth/AuthUseCase');
const patientUseCase = require('../usecase/patient/PatientUseCase');
const doctorUseCase = require('../usecase/doctor/DoctorUseCase');

// @desc    Register a new user (Patient)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const result = await patientUseCase.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authUseCase.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let user;
    if (req.user.role === 'Patient') {
      user = await patientUseCase.getProfile(userId);
    } else if (req.user.role === 'Doctor') {
      user = await doctorUseCase.getProfile(userId);
    } else {
      // Admin profile or generic
      user = await patientUseCase.getProfile(userId); // Fallback
    }
    
    if (user) {
      // Sanitize password
      const userObj = user.toObject();
      delete userObj.password;
      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    let result;
    if (req.user.role === 'Patient') {
      result = await patientUseCase.updateProfile(userId, req.body);
    } else if (req.user.role === 'Doctor') {
      result = await doctorUseCase.updateProfile(userId, req.body);
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await authUseCase.forgotPassword(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const result = await authUseCase.resetPassword(email, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const result = await authUseCase.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Change password for logged-in user
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await authUseCase.changePassword(req.user._id, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  changePassword
};


