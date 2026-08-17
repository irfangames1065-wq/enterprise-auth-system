const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendOtpEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const otp = generateOtpCode();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      otp,
      otpExpire,
      isVerified: false
    });

    try {
      const emailResult = await sendOtpEmail(user, otp);

      return res.status(201).json({
        success: true,
        message: `Registration successful! An OTP code was sent to ${user.email}.`,
        email: user.email,
        requiresOtp: true,
        demoMode: emailResult.demoMode,
        otpPreview: emailResult.demoMode ? otp : undefined
      });
    } catch (error) {
      console.error('[AUTH] sendOtpEmail failed during register:', error.message);
      return res.status(500).json({
        success: false,
        message: 'We could not send the OTP email right now. Please try again in a moment.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for Registration or Verification
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), select: '+password' });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    if (!user.otp || user.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP verification code.' });
    }

    if (user.otpExpire && new Date(user.otpExpire) < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP verification code has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    user.lastLogin = new Date();

    const userId = user._id || user.id;
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(refreshToken);
    if (typeof user.save === 'function') await user.save();

    await sendWelcomeEmail(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Account successfully verified! Welcome aboard.',
      accessToken,
      refreshToken,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP Verification Code
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with this email address.' });
    }

    const otp = generateOtpCode();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    if (typeof user.save === 'function') await user.save();

    try {
      const emailResult = await sendOtpEmail(user, otp);

      return res.status(200).json({
        success: true,
        message: `A new 6-digit OTP has been sent to ${user.email}.`,
        demoMode: emailResult.demoMode,
        otpPreview: emailResult.demoMode ? otp : undefined
      });
    } catch (error) {
      console.error('[AUTH] sendOtpEmail failed during resendOtp:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to resend the OTP email right now. Please try again.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate User & Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), select: '+password' });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = typeof user.matchPassword === 'function' 
      ? await user.matchPassword(password) 
      : (user.password === password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      const otp = generateOtpCode();
      user.otp = otp;
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
      if (typeof user.save === 'function') await user.save();

      try {
        const emailResult = await sendOtpEmail(user, otp);

        return res.status(200).json({
          success: false,
          requiresOtp: true,
          message: 'Account not verified. A new OTP has been dispatched to your email.',
          email: user.email,
          demoMode: emailResult.demoMode,
          otpPreview: emailResult.demoMode ? otp : undefined
        });
      } catch (error) {
        console.error('[AUTH] sendOtpEmail failed during login:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Your account needs verification, but we could not send the OTP email right now.'
        });
      }
    }

    user.lastLogin = new Date();
    const userId = user._id || user.id;
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(refreshToken);
    if (typeof user.save === 'function') await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      accessToken,
      refreshToken,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken && req.user && req.user.refreshTokens) {
      req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== refreshToken);
      if (typeof req.user.save === 'function') await req.user.save();
    }

    res.clearCookie('refreshToken');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token missing.' });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const userId = user._id || user.id;
    const newAccessToken = generateAccessToken(userId, user.role);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email address, password reset instructions have been dispatched.'
      });
    }

    const otp = generateOtpCode();
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    if (typeof user.save === 'function') await user.save();

    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${otp}&email=${encodeURIComponent(user.email)}`;
      const emailResult = await sendPasswordResetEmail(user, resetUrl);

      return res.status(200).json({
        success: true,
        message: `Password reset link dispatched to ${user.email}.`,
        demoMode: emailResult.demoMode,
        tokenPreview: emailResult.demoMode ? otp : undefined,
        resetUrlPreview: emailResult.demoMode ? resetUrl : undefined
      });
    } catch (error) {
      console.error('[AUTH] sendPasswordResetEmail failed:', error.message);
      return res.status(500).json({
        success: false,
        message: 'We could not send the password reset email right now.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, token, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token.toString().trim()
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    if (typeof user.save === 'function') await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe
};
