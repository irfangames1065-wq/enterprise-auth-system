const User = require('../models/UserModel');

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user/admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin Only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.role = role;
    if (typeof user.save === 'function') await user.save();

    const userId = user._id || user.id;
    return res.status(200).json({
      success: true,
      message: `Role for ${user.name} updated to ${role}.`,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (req.params.id === userId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `User ${user.email} removed from system.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics stats
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        adminCount,
        unverifiedUsers: totalUsers - verifiedUsers,
        securityLevel: 'Enterprise SSL + JWT + Bcrypt'
      },
      recentUsers: recentUsers.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats
};
