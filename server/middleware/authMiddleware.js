const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token missing.'
    });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token expired or invalid.'
    });
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed.'
    });
  }
};

module.exports = { protect };
