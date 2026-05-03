const userRepository = require('../../repository/UserRepository');
const jwtService = require('../../infrastructure/security/JwtService');

class DoctorUseCase {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user || user.role !== 'Doctor') {
      throw new Error('Doctor not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user || user.role !== 'Doctor') {
      throw new Error('Doctor not found');
    }

    user.name = updateData.name || user.name;
    user.email = updateData.email || user.email;
    user.specialty = updateData.specialty || user.specialty;
    user.contactNumber = updateData.contactNumber || user.contactNumber;
    user.availability = updateData.availability || user.availability;

    if (updateData.password) {
      user.password = updateData.password;
    }

    const updatedUser = await userRepository.save(user);

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      specialty: updatedUser.specialty,
      token: jwtService.generateToken(updatedUser._id)
    };
  }

  async getAllDoctors() {
    return await userRepository.findAllDoctors();
  }
}

module.exports = new DoctorUseCase();
