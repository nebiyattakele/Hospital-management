const jwt = require('jsonwebtoken');

class JwtService {
  generateAccessToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '15m', // Short-lived access token
    });
  }

  generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || 'refreshsecret123', {
      expiresIn: '7d', // Long-lived refresh token
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refreshsecret123');
    } catch (error) {
      return null;
    }
  }

}

module.exports = new JwtService();
