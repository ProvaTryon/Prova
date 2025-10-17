const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * @description Defines the structure for user documents in MongoDB
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  birth_date: {
    type: Date
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'admin', 'store_owner', 'customer_service'],
      message: '{VALUE} is not a valid role'
    },
    default: 'customer'
  },
  refreshToken: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

/**
 * Instance Method: Compare password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance Method: Check if user is admin
 * @returns {boolean} True if user has admin role
 */
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

/**
 * Instance Method: Check if user is store owner
 * @returns {boolean} True if user has store_owner role
 */
userSchema.methods.isStoreOwner = function() {
  return this.role === 'store_owner';
};

/**
 * Pre-save hook: Update lastLogin timestamp
 */
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);