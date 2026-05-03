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

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (doctor && doctor.role === 'Doctor') {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (doctor && doctor.role === 'Doctor') {
      doctor.name = req.body.name || doctor.name;
      doctor.email = req.body.email || doctor.email;
      doctor.specialty = req.body.specialty || doctor.specialty;
      doctor.contactNumber = req.body.contactNumber || doctor.contactNumber;
      doctor.availability = req.body.availability || doctor.availability;
      
      if (req.body.password) {
        doctor.password = req.body.password;
      }

      const updatedDoctor = await doctor.save();
      res.json({
        _id: updatedDoctor._id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        specialty: updatedDoctor.specialty,
        contactNumber: updatedDoctor.contactNumber,
        availability: updatedDoctor.availability
      });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (doctor && doctor.role === 'Doctor') {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'Doctor removed' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor };
