import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu_jwt_super_secure_secret_key_2026_987654';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function protect(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied: No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (isDbConnected()) {
      try {
        // Look up by email first (most reliable), then by id
        user = await User.findOne({
          $or: [{ email: decoded.email }, { id: decoded.id }],
        }).select('-password');
      } catch (e) {
        // Fallback to store
      }
    }

    if (!user) {
      user = store.users.find((u) => u.id === decoded.id || (decoded.email && u.email === decoded.email));
    }

    // If still no user (e.g. admin@gmail.com not yet seeded), synthesize from JWT
    if (!user) {
      user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.role === 'admin' ? 'Platform Administrator' : decoded.email,
      };
    }

    // Always trust JWT-issued role and email (prevent DB stale-role bypass)
    if (user && decoded.email) {
      const userObj = user.toObject ? user.toObject() : { ...user };
      userObj.role = decoded.role || userObj.role;
      userObj.email = decoded.email || userObj.email;
      req.user = userObj;
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Access denied: Authentication token is invalid or expired.' });
  }
}

export async function optionalAuth(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      let user = null;
      if (isDbConnected()) {
        try {
          user = await User.findOne({ $or: [{ id: decoded.id }, { email: decoded.email }] }).select('-password');
        } catch (e) {
          // ignore
        }
      }
      if (!user) {
        user = store.users.find((u) => u.id === decoded.id || (decoded.email && u.email === decoded.email));
      }
      if (user) req.user = user;
    } catch (e) {
      // Ignore invalid optional tokens
    }
  }

  next();
}

export function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const userEmail = (req.user.email || '').trim().toLowerCase();

    const isDesignatedAdmin = userEmail === adminEmail && req.user.role === 'admin';

    // Authorized admin has global access across admin and roles
    if (isDesignatedAdmin) {
      return next();
    }

    // If route requires admin, only admin@gmail.com is allowed
    if (roles.includes('admin') && !isDesignatedAdmin) {
      return res.status(403).json({
        error: 'Access denied. Only the authorized platform administrator can access this resource.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
      });
    }

    next();
  };
}
