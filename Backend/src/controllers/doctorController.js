const User = require('../domain/User');

// @desc    Register a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const registerDoctor = async (req, res) => {
  const { name, email, password, specialty, contactNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const doctor = await User.create({
      name,
      email,
      password,
      role: 'Doctor',
      specialty,
      contactNumber
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      role: doctor.role,
      specialty: doctor.specialty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const query = { role: 'Doctor' };
    if (req.query.specialty) {
      query.specialty = { $regex: req.query.specialty, $options: 'i' };
    }
    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerDoctor, getDoctors };
