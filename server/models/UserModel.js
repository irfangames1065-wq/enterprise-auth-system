const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');

// In-memory fallback map for offline / dev testing
const inMemoryUsers = new Map();

// Seed initial demo users into memory
const seedDemoUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedUserPass = await bcrypt.hash('password123', salt);
  const hashedAdminPass = await bcrypt.hash('adminpass123', salt);

  const demoUser = {
    _id: 'user-demo-id-101',
    name: 'Demo User',
    email: 'user@nexus.io',
    password: hashedUserPass,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    refreshTokens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (entered) {
      return await bcrypt.compare(entered, this.password);
    }
  };

  const demoAdmin = {
    _id: 'admin-demo-id-202',
    name: 'Demo Administrator',
    email: 'admin@nexus.io',
    password: hashedAdminPass,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    refreshTokens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    matchPassword: async function (entered) {
      return await bcrypt.compare(entered, this.password);
    }
  };

  inMemoryUsers.set(demoUser.email, demoUser);
  inMemoryUsers.set(demoAdmin.email, demoAdmin);
};

seedDemoUsers();

const isConnected = () => mongoose.connection.readyState === 1;

class UserModel {
  static async findOne(query) {
    if (isConnected()) {
      const where = query.email ? { email: query.email.toLowerCase() } : query;
      const q = User.findOne(where);
      if (query.select === '+password') return q.select('+password');
      return q;
    }

    if (query.email) {
      return inMemoryUsers.get(query.email.toLowerCase()) || null;
    }

    if (query._id) {
      for (const u of inMemoryUsers.values()) {
        if (u._id === query._id || u.id === query._id) return u;
      }
      return null;
    }

    if (query.resetPasswordToken) {
      for (const u of inMemoryUsers.values()) {
        if (u.resetPasswordToken === query.resetPasswordToken && u.resetPasswordExpire > new Date()) {
          return u;
        }
      }
    }
    return null;
  }

  static async findById(id) {
    if (isConnected()) {
      return User.findById(id);
    }
    for (const u of inMemoryUsers.values()) {
      if (u._id === id || u.id === id) return u;
    }
    return null;
  }

  static async create(userData) {
    if (isConnected()) {
      return await User.create(userData);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isVerified: userData.isVerified || false,
      otp: userData.otp || null,
      otpExpire: userData.otpExpire || null,
      refreshTokens: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, this.password);
      },
      save: async function () {
        this.updatedAt = new Date();

        if (this.password && !this.password.startsWith('$2')) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }

        inMemoryUsers.set(this.email, this);
        return this;
      }
    };

    inMemoryUsers.set(newUser.email, newUser);
    return newUser;
  }

  static async find() {
    if (isConnected()) {
      return User.find();
    }
    return Array.from(inMemoryUsers.values());
  }

  static async countDocuments(filter = {}) {
    if (isConnected()) {
      return User.countDocuments(filter);
    }
    const all = Array.from(inMemoryUsers.values());
    if (filter.isVerified !== undefined) {
      return all.filter((u) => u.isVerified === filter.isVerified).length;
    }
    if (filter.role) {
      return all.filter((u) => u.role === filter.role).length;
    }
    return all.length;
  }

  static async findByIdAndDelete(id) {
    if (isConnected()) {
      return User.findByIdAndDelete(id);
    }
    for (const [email, u] of inMemoryUsers.entries()) {
      if (u._id === id || u.id === id) {
        inMemoryUsers.delete(email);
        return u;
      }
    }
    return null;
  }
}

module.exports = UserModel;
