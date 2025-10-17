const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @middleware protect
 * @description Verify JWT token and authenticate user
 * @access Protected routes
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login to access this resource.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error.message);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @middleware authorize
 * @description Check if user has required role(s)
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource is restricted to: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * @middleware optionalAuth
 * @description Authenticate user if token exists, but don't fail if not
 * @description Useful for routes that work for both guests and authenticated users
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Extract token if exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Verify and attach user if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (user && user.isActive) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }

    next();
  } catch (error) {
    // Don't fail on token errors, just continue without auth
    next();
  }
};
