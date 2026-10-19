import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();

// Rate limiter for login: max 10 failed attempts per 10 minutes per IP
const loginRateLimits = new Map();

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 10;

  const record = loginRateLimits.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }
  loginRateLimits.set(ip, record);
  return record.count <= maxAttempts;
}

export async function register(req, res) {
  try {
    const { name, email, password, phone, role, roleData } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent self-registration as admin
    if (role === 'admin' && normalizedEmail !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Self-registration as administrator is restricted. Only admin@gmail.com is authorized.' });
    }

    // Check existing in DB
    if (isDbConnected()) {
      try {
        const existingInDb = await User.findOne({ email: normalizedEmail });
        if (existingInDb) {
          return res.status(400).json({ error: 'An account with this email already exists' });
        }
      } catch (e) {
        // Fallback
      }
    }

    // Check existing in memory store
    const existingMem = store.users.find((u) => u.email === normalizedEmail);
    if (existingMem) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const finalRole = normalizedEmail === ADMIN_EMAIL ? 'admin' : (role === 'admin' ? 'farmer' : (role || 'farmer'));
    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: userId,
      uid: userId,
      name: name || (finalRole === 'admin' ? 'Platform Administrator' : 'KisanSetu Member'),
      displayName: name || (finalRole === 'admin' ? 'Platform Administrator' : 'KisanSetu Member'),
      email: normalizedEmail,
      passwordHash,
      phone: phone || '',
      phoneNumber: phone || '',
      role: finalRole,
      isVerified: finalRole === 'admin',
      isOnline: true,
      status: 'online',
      location: roleData?.location || 'Warangal, Telangana',
      address: roleData?.address || '',
      lastActive: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ...(finalRole === 'admin'
        ? {
            adminDepartment: 'Platform Security & Operations',
            clearanceLevel: 'Tier 1 Admin Access',
          }
        : {}),
      ...roleData,
    };

    store.users.unshift(newUser);

    if (isDbConnected()) {
      try {
        const mongoUser = new User({ ...newUser, password });
        await mongoUser.save();
      } catch (e) {
        console.warn('MongoDB save user note:', e.message);
      }
    }

    const token = generateToken({ id: newUser.id, role: newUser.role, email: newUser.email });
    const userJson = { ...newUser };
    delete userJson.passwordHash;
    delete userJson.password;

    res.status(201).json({
      success: true,
      token,
      user: userJson,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed. Please verify your details.' });
  }
}

export async function login(req, res) {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (!checkLoginRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Too many login attempts. Please wait 10 minutes before attempting to log in again.',
      });
    }

    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isTargetingAdmin = role === 'admin' || normalizedEmail === ADMIN_EMAIL;

    // Strict Admin Authorization Check:
    if (isTargetingAdmin) {
      if (normalizedEmail !== ADMIN_EMAIL) {
        return res.status(401).json({
          error: 'Access denied: Unauthorized administrator account. Only the authorized administrator (admin@gmail.com) can access the Admin Portal.',
        });
      }

      // Verify admin password securely on backend
      const configuredAdminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      let isPasswordValid = password === configuredAdminPassword;

      let adminUser = null;
      if (isDbConnected()) {
        try {
          const dbUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
          if (dbUser) {
            adminUser = dbUser.toObject();
            if (dbUser.password) {
              const hashMatch = bcrypt.compareSync(password, dbUser.password);
              if (hashMatch) isPasswordValid = true;
            }
          }
        } catch (e) {
          // Fall through
        }
      }

      if (!adminUser) {
        adminUser = store.users.find((u) => u.email === ADMIN_EMAIL);
      }

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid Administrator credentials. Please verify your password.',
        });
      }

      // Ensure admin user exists in DB & memory store
      if (!adminUser) {
        const adminId = 'usr-admin-primary';
        adminUser = {
          id: adminId,
          uid: adminId,
          name: 'Platform Administrator',
          displayName: 'Platform Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
          isVerified: true,
          adminDepartment: 'Platform Security & Operations',
          clearanceLevel: 'Tier 1 Admin Access',
          location: 'Warangal, Telangana',
          isOnline: true,
          status: 'online',
          lastActive: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        store.users.unshift(adminUser);

        if (isDbConnected()) {
          try {
            const mongoAdmin = new User({ ...adminUser, password: configuredAdminPassword });
            await mongoAdmin.save();
          } catch (e) {
            // Ignore if exists
          }
        }
      } else {
        adminUser.role = 'admin';
        adminUser.lastLoginAt = new Date().toISOString();
        adminUser.lastActive = new Date().toISOString();
        adminUser.isOnline = true;
        adminUser.status = 'online';

        if (isDbConnected()) {
          try {
            await User.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin', isOnline: true, status: 'online', lastLoginAt: new Date().toISOString() } });
          } catch (e) {
            // non-blocking
          }
        }
      }

      const token = generateToken({ id: adminUser.id || 'usr-admin-primary', role: 'admin', email: ADMIN_EMAIL });
      const userJson = { ...adminUser };
      delete userJson.passwordHash;
      delete userJson.password;

      return res.json({
        success: true,
        token,
        user: userJson,
      });
    }

    // Standard Non-Admin User Authentication
    let user = null;
    if (isDbConnected()) {
      try {
        const dbUser = await User.findOne({ email: normalizedEmail }).select('+password');
        if (dbUser) {
          user = dbUser.toObject();
          user.passwordHash = dbUser.password;
        }
      } catch (e) {
        // Fallback
      }
    }

    if (!user) {
      user = store.users.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please sign up.' });
    }

    const isMatch = user.passwordHash
      ? bcrypt.compareSync(password, user.passwordHash)
      : false;

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    if (role && role !== 'admin') {
      user.role = role;
    }
    user.lastLoginAt = new Date().toISOString();
    user.lastActive = new Date().toISOString();
    user.isOnline = true;
    user.status = 'online';

    if (isDbConnected()) {
      try {
        await User.updateOne({ email: normalizedEmail }, { $set: { lastLoginAt: user.lastLoginAt, lastActive: user.lastActive, isOnline: true, status: 'online' } });
      } catch (e) {
        // non-blocking
      }
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const userJson = { ...user };
    delete userJson.passwordHash;
    delete userJson.password;

    res.json({
      success: true,
      token,
      user: userJson,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed. Please check your credentials.' });
  }
}

export async function googleLogin(req, res) {
  try {
    const { email, name, photoUrl, role } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Google email is required' });
    }

    // Strictly disallow Google login for admin portal
    if (role === 'admin' || normalizedEmail === ADMIN_EMAIL) {
      return res.status(403).json({
        error: 'Google Sign-In is disabled for the Administrator Portal. Please use password authentication.',
      });
    }

    let user = null;
    if (isDbConnected()) {
      try {
        const dbUser = await User.findOne({ email: normalizedEmail });
        if (dbUser) user = dbUser.toObject();
      } catch (e) {}
    }
    if (!user) {
      user = store.users.find((u) => u.email === normalizedEmail);
    }

    const finalRole = role && role !== 'admin' ? role : 'farmer';

    if (!user) {
      const userId = `usr-g-${Date.now()}`;
      user = {
        id: userId,
        uid: userId,
        name: name || 'Google Verified Farmer',
        displayName: name || 'Google Verified Farmer',
        email: normalizedEmail,
        photoUrl: photoUrl || null,
        photoURL: photoUrl || null,
        role: finalRole,
        isVerified: true,
        isOnline: true,
        status: 'online',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      store.users.unshift(user);

      if (isDbConnected()) {
        try {
          const mongoUser = new User(user);
          await mongoUser.save();
        } catch (e) {}
      }
    } else {
      user.lastLoginAt = new Date().toISOString();
      user.isOnline = true;
      user.status = 'online';
      if (role && role !== 'admin') user.role = role;
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const userJson = { ...user };
    delete userJson.passwordHash;
    delete userJson.password;

    res.json({ success: true, token, user: userJson });
  } catch (error) {
    res.status(500).json({ error: 'Google authentication failed' });
  }
}

export async function phoneLogin(req, res) {
  try {
    const { phone, role, name } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Strictly disallow phone login for admin role
    if (role === 'admin') {
      return res.status(403).json({
        error: 'Phone login is disabled for the Administrator Portal. Please use password authentication.',
      });
    }

    let user = store.users.find((u) => u.phone === phone || u.phoneNumber === phone);

    if (!user) {
      const userId = `usr-p-${Date.now()}`;
      user = {
        id: userId,
        uid: userId,
        name: name || 'Mobile Verified Farmer',
        displayName: name || 'Mobile Verified Farmer',
        email: `farmer.${phone.replace(/[^0-9]/g, '').slice(-10)}@kisansetu.in`,
        phone,
        phoneNumber: phone,
        role: role || 'farmer',
        isVerified: true,
        isOnline: true,
        status: 'online',
        createdAt: new Date().toISOString(),
      };
      store.users.unshift(user);
    } else {
      user.lastLoginAt = new Date().toISOString();
      user.isOnline = true;
      user.status = 'online';
      if (role && role !== 'admin') user.role = role;
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const userJson = { ...user };
    delete userJson.passwordHash;
    delete userJson.password;

    res.json({ success: true, token, user: userJson });
  } catch (error) {
    res.status(500).json({ error: 'Phone authentication failed' });
  }
}

export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userJson = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete userJson.password;
    delete userJson.passwordHash;
    res.json(userJson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const updates = { ...req.body };
    delete updates.password;
    delete updates.passwordHash;

    if (updates.role === 'admin' && user.email !== ADMIN_EMAIL) {
      delete updates.role;
    }

    Object.assign(user, updates);
    user.lastActive = new Date().toISOString();

    const memIdx = store.users.findIndex((u) => u.id === user.id);
    if (memIdx >= 0) {
      Object.assign(store.users[memIdx], updates);
    }

    if (isDbConnected()) {
      try {
        await User.updateOne({ $or: [{ id: user.id }, { email: user.email }] }, { $set: updates });
      } catch (e) {
        // non-blocking
      }
    }

    const userJson = { ...user };
    delete userJson.passwordHash;
    delete userJson.password;
    res.json({ success: true, user: userJson });
  } catch (error) {
    res.status(500).json({ error: 'Update profile failed' });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = store.users.find((u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.passwordHash = bcrypt.hashSync(newPassword, 10);

    if (isDbConnected()) {
      try {
        const u = await User.findOne({ id: req.user.id });
        if (u) {
          u.password = newPassword;
          await u.save();
        }
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed' });
  }
}

// Admin-only: Get all users with sanitized fields
export async function getAllUsers(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        if (users && users.length > 0) return res.json(users);
      } catch (e) {
        // fall through
      }
    }

    const sanitized = store.users.map((u) => {
      const copy = { ...u };
      delete copy.passwordHash;
      delete copy.password;
      return copy;
    });
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load users' });
  }
}

export async function getUserById(req, res) {
  try {
    const user = store.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const copy = { ...user };
    delete copy.passwordHash;
    delete copy.password;
    res.json(copy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find user' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const user = store.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (role === 'admin' && user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Cannot assign administrator role to non-admin email' });
    }

    user.role = role;
    if (isDbConnected()) {
      try {
        await User.updateOne({ id: req.params.id }, { $set: { role } });
      } catch (e) {}
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { isOnline, status } = req.body;
    const user = store.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isOnline = isOnline !== undefined ? isOnline : user.isOnline;
    user.status = status || (isOnline ? 'online' : 'offline');
    user.lastActive = new Date().toISOString();

    if (isDbConnected()) {
      try {
        await User.updateOne({ id: req.params.id }, { $set: { isOnline: user.isOnline, status: user.status, lastActive: user.lastActive } });
      } catch (e) {}
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}

export async function syncUser(req, res) {
  try {
    const { id, name, email, photoUrl, role, phone, location, businessName, bankDetails } = req.body;
    if (!id) return res.status(400).json({ error: 'User ID is required' });

    let user = store.users.find((u) => u.id === id);
    if (!user) {
      user = {
        id,
        uid: id,
        name: name || 'KisanSetu User',
        displayName: name || 'KisanSetu User',
        email: email || `user-${id}@kisansetu.in`,
        photoUrl,
        photoURL: photoUrl,
        role: role === 'admin' ? (email === ADMIN_EMAIL ? 'admin' : 'farmer') : (role || 'farmer'),
        phone: phone || '',
        phoneNumber: phone || '',
        location: location || 'India',
        businessName,
        bankDetails,
        isVerified: true,
      };
      store.users.unshift(user);
    } else {
      if (name) { user.name = name; user.displayName = name; }
      if (email) user.email = email;
      if (photoUrl) { user.photoUrl = photoUrl; user.photoURL = photoUrl; }
      if (role && role !== 'admin') user.role = role;
      if (phone) { user.phone = phone; user.phoneNumber = phone; }
      if (location) user.location = location;
      if (businessName) user.businessName = businessName;
      if (bankDetails) user.bankDetails = bankDetails;
      user.lastActive = new Date().toISOString();
    }

    const userJson = { ...user };
    delete userJson.passwordHash;
    res.json({ success: true, user: userJson });
  } catch (error) {
    res.status(500).json({ error: 'User sync failed' });
  }
}

export async function verifyUser(req, res) {
  try {
    const user = store.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isVerified = true;
    if (isDbConnected()) {
      try {
        await User.updateOne({ id: req.params.id }, { $set: { isVerified: true } });
      } catch (e) {}
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify user' });
  }
}

export async function logout(req, res) {
  try {
    if (req.user) {
      req.user.isOnline = false;
      req.user.status = 'offline';
      req.user.lastActive = new Date().toISOString();
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
}
