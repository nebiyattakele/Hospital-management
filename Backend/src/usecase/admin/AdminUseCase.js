const userRepository = require('../../repository/UserRepository');

class AdminUseCase {
  async getAllUsers() {
    return await userRepository.find({});
  }


  async createDoctor(doctorData) {
    const { name, email, password, specialty } = doctorData;
    
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    return await userRepository.create({
      name,
      email,
      password,
      role: 'Doctor',
      specialty
    });
  }

  async deleteUser(userId) {
    return await userRepository.delete(userId);
  }
}

module.exports = new AdminUseCase();
