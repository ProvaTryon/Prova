const Merchant = require('../models/Merchant');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @class MerchantController
 * @description Handles all merchant-related operations
 */

// ==========================================
// Helper Functions
// ==========================================

/**
 * Format merchant response
 * @param {Object} merchant - Merchant document
 * @returns {Object} Formatted merchant
 */
const formatMerchant = (merchant) => {
    return {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        phone: merchant.phone,
        address: merchant.address,
        companyName: merchant.companyName,
        companyId: merchant.companyId,
        nationalId: merchant.nationalId,
        products: merchant.products,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
    };
};

// ==========================================
// Controller Methods
// ==========================================

/**
 * @route   GET /api/merchants
 * @desc    Get all merchants with pagination
 * @access  Public or Admin
 */
exports.getAllMerchants = async (req, res, next) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            sort = '-createdAt',
        } = req.query;

        // Build filter query
        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * pageSize;

        // Get total count
        const total = await Merchant.countDocuments(filter);
        const totalPages = Math.ceil(total / pageSize);

        // Fetch merchants
        const merchants = await Merchant.find(filter)
            .select('-password')
            .populate('products', 'name price stock')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();

        res.status(200).json({
            success: true,
            count: merchants.length,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages,
            },
            data: merchants.map(formatMerchant),
        });
    } catch (error) {
        console.error('❌ Get All Merchants Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching merchants',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   GET /api/merchants/:id
 * @desc    Get a single merchant by ID
 * @access  Public
 */
exports.getMerchantById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const merchant = await Merchant.findById(id)
            .select('-password')
            .populate('products', 'name price stock category images');

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: 'Merchant not found',
            });
        }

        res.status(200).json({
            success: true,
            data: formatMerchant(merchant),
        });
    } catch (error) {
        console.error('❌ Get Merchant By ID Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid merchant ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching merchant',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   POST /api/merchants
 * @desc    Create a new merchant
 * @access  Private - Admin only
 */
exports.createMerchant = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            companyName,
            companyId,
            nationalId,
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and phone',
            });
        }

        // Check if merchant already exists
        const existingMerchant = await Merchant.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingMerchant) {
            return res.status(400).json({
                success: false,
                message: 'Merchant with this email or phone already exists',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create merchant
        const merchant = await Merchant.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address: address || '',
            companyName: companyName || '',
            companyId: companyId || '',
            nationalId: nationalId || '',
        });

        // Remove password from response
        merchant.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Merchant created successfully',
            data: formatMerchant(merchant),
        });
    } catch (error) {
        console.error('❌ Create Merchant Error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `Merchant with this ${field} already exists`,
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating merchant',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   PUT /api/merchants/:id
 * @desc    Update a merchant
 * @access  Private - Admin or Merchant Owner
 */
exports.updateMerchant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            address,
            companyName,
            companyId,
            nationalId,
        } = req.body;

        // Find merchant
        const merchant = await Merchant.findById(id);
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: 'Merchant not found',
            });
        }

        // Authorization check: Admin can update any, store_owner can only update their own
        if (req.user.role === 'store_owner') {
            // Find if this merchant belongs to the user
            const userMerchant = await Merchant.findOne({ _id: id, owner: req.user.id });
            if (!userMerchant) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this merchant',
                });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins and merchant owners can update merchants',
            });
        }

        // Build update object
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (companyName !== undefined) updateData.companyName = companyName;
        if (companyId !== undefined) updateData.companyId = companyId;
        if (nationalId !== undefined) updateData.nationalId = nationalId;

        // Update merchant
        const updatedMerchant = await Merchant.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).select('-password').populate('products', 'name price stock');

        res.status(200).json({
            success: true,
            message: 'Merchant updated successfully',
            data: formatMerchant(updatedMerchant),
        });
    } catch (error) {
        console.error('❌ Update Merchant Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid merchant ID format',
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `Merchant with this ${field} already exists`,
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating merchant',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   DELETE /api/merchants/:id
 * @desc    Delete a merchant
 * @access  Private - Admin only
 */
exports.deleteMerchant = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find merchant
        const merchant = await Merchant.findById(id);
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: 'Merchant not found',
            });
        }

        // Only admin can delete
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete merchants',
            });
        }

        // Delete merchant
        await Merchant.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Merchant deleted successfully',
        });
    } catch (error) {
        console.error('❌ Delete Merchant Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid merchant ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting merchant',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   GET /api/merchants/:id/products
 * @desc    Get all products for a specific merchant
 * @access  Public
 */
exports.getMerchantProducts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Check if merchant exists
        const merchant = await Merchant.findById(id);
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: 'Merchant not found',
            });
        }

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * pageSize;

        // Import Product model
        const Product = require('../models/Product');

        // Get total count
        const total = await Product.countDocuments({ merchant: id });
        const totalPages = Math.ceil(total / pageSize);

        // Fetch products
        const products = await Product.find({ merchant: id })
            .skip(skip)
            .limit(pageSize)
            .lean();

        res.status(200).json({
            success: true,
            merchantId: id,
            count: products.length,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages,
            },
            data: products,
        });
    } catch (error) {
        console.error('❌ Get Merchant Products Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid merchant ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching merchant products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   PUT /api/merchants/:id/change-password
 * @desc    Change merchant password
 * @access  Private - Admin or Merchant Owner
 */
exports.changeMerchantPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current password and new password',
            });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters',
            });
        }

        // Find merchant with password
        const merchant = await Merchant.findById(id).select('+password');
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: 'Merchant not found',
            });
        }

        // Authorization check
        if (req.user.role === 'store_owner') {
            const userMerchant = await Merchant.findOne({ _id: id, owner: req.user.id });
            if (!userMerchant) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to change this merchant password',
                });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Verify current password (skip for admin)
        if (req.user.role !== 'admin') {
            const isPasswordValid = await bcrypt.compare(currentPassword, merchant.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect',
                });
            }
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        merchant.password = await bcrypt.hash(newPassword, salt);

        await merchant.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('❌ Change Merchant Password Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid merchant ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
