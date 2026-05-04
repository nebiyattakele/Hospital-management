const jwtService = require('../infrastructure/security/JwtService');
const userRepository = require('../repository/UserRepository');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwtService.verifyAccessToken(token);

      if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      req.user = await userRepository.findById(decoded.id);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const doctor = (req, res, next) => {
  if (req.user && req.user.role === 'Doctor') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a doctor' });
  }
};

const patient = (req, res, next) => {
  if (req.user && req.user.role === 'Patient') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a patient' });
  }
};

module.exports = { protect, admin, doctor, patient };
