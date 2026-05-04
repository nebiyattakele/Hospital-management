const userRepository = require('../../repository/UserRepository');
const jwtService = require('../../infrastructure/security/JwtService');
const passwordService = require('../../infrastructure/security/PasswordService');

class PatientUseCase {
  async register(userData) {
    const { name, email, password } = userData;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      role: 'Patient'
    });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: jwtService.generateAccessToken(user._id),
        refreshToken: jwtService.generateRefreshToken(user._id)
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update fields
    user.name = updateData.name || user.name;
    user.email = updateData.email || user.email;
    user.age = updateData.age || user.age;
    user.gender = updateData.gender || user.gender;
    user.address = updateData.address || user.address;
    user.profilePicture = updateData.profilePicture || user.profilePicture;

    if (updateData.password) {
      user.password = updateData.password; // Mongoose middleware will hash it, or we could hash it here
    }

    const updatedUser = await userRepository.save(user);
    
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      accessToken: jwtService.generateAccessToken(updatedUser._id),
      refreshToken: jwtService.generateRefreshToken(updatedUser._id)
    };

  }
}

module.exports = new PatientUseCase();
