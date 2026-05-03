const userRepository = require('../../repository/UserRepository');
const jwtService = require('../../infrastructure/security/JwtService');
const emailService = require('../../infrastructure/services/EmailService');

class AuthUseCase {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwtService.generateToken(user._id)
      };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User with this email does not exist');
    }

    // In a real app, generate a reset token
    const resetToken = 'dummy-reset-token'; 
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(email, newPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    await userRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}

module.exports = new AuthUseCase();
