const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'enterprise-jwt-secret-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'enterprise-refresh-secret-key-2026';

const generateAccessToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
