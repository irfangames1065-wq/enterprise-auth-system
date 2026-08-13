const User = require('../models/UserModel');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, avatar } = req.body;

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;

    if (typeof user.save === 'function') await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/user/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please enter your current and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    const isMatch = typeof user.matchPassword === 'function'
      ? await user.matchPassword(currentPassword)
      : (user.password === currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    if (typeof user.save === 'function') await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully changed!'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
