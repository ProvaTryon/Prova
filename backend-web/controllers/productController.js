const Product = require('../models/Product');
const Merchant = require('../models/Merchant');

/**
 * @class ProductController
 * @description Handles all product-related operations
 */

// ==========================================
// Helper Functions
// ==========================================

/**
 * Build filter query based on request parameters
 * @param {Object} query - Query parameters
 * @returns {Object} MongoDB filter object
 */
const buildFilterQuery = (query) => {
    const filter = {};

    // Search by name or description
    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } }
        ];
    }

    // Filter by category
    if (query.category) {
        filter.category = query.category;
    }

    // Filter by merchant
    if (query.merchant) {
        filter.merchant = query.merchant;
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
        if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
    }

    // Filter by stock availability
    if (query.inStock === 'true') {
        filter.stock = { $gt: 0 };
    } else if (query.inStock === 'false') {
        filter.stock = 0;
    }

    return filter;
};

/**
 * Format product response
 * @param {Object} product - Product document
 * @returns {Object} Formatted product
 */
const formatProduct = (product) => {
    return {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        merchant: product.merchant,
        category: product.category,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

// ==========================================
// Controller Methods
// ==========================================

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, searching, and pagination
 * @access  Public
 */
exports.getAllProducts = async (req, res, next) => {
    try {
        const {
            search,
            category,
            merchant,
            minPrice,
            maxPrice,
            inStock,
            page = 1,
            limit = 10,
            sort = '-createdAt',
        } = req.query;

        // Build filter query
        const filter = buildFilterQuery({
            search,
            category,
            merchant,
            minPrice,
            maxPrice,
            inStock,
        });

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 per page
        const skip = (pageNum - 1) * pageSize;

        // Get total count for pagination
        const total = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / pageSize);

        // Fetch products
        const products = await Product.find(filter)
            .populate('merchant', 'name logo')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages,
            },
            data: products.map(formatProduct),
        });
    } catch (error) {
        console.error('❌ Get All Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate('merchant', 'name logo email phone');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: formatProduct(product),
        });
    } catch (error) {
        console.error('❌ Get Product By ID Error:', error);

        // Handle invalid MongoDB ID
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private - Admin or Store Owner
 */
exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category, images } = req.body;

        // Validate required fields
        if (!name || !price || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, price, and stock',
            });
        }

        // Validate price and stock
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative',
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative',
            });
        }

        // If user is store_owner, set merchant to their merchant ID
        // If user is admin, allow setting merchant through request body
        let merchantId = null;

        if (req.user.role === 'store_owner') {
            // Find merchant associated with this user
            const merchant = await Merchant.findOne({ owner: req.user.id });
            if (!merchant) {
                return res.status(400).json({
                    success: false,
                    message: 'You must have a merchant profile to create products',
                });
            }
            merchantId = merchant._id;
        } else if (req.user.role === 'admin') {
            merchantId = req.body.merchant;
        }

        // Create product
        const product = await Product.create({
            name,
            description: description || '',
            price,
            stock,
            merchant: merchantId,
            category: category || '',
            images: images || [],
        });

        // Populate merchant info
        await product.populate('merchant', 'name logo');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: formatProduct(product),
        });
    } catch (error) {
        console.error('❌ Create Product Error:', error);

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
            message: 'Error creating product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private - Admin or Product Owner (Store Owner)
 */
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, images } = req.body;

        // Find product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check authorization: Only admin or product's merchant can update
        if (req.user.role === 'store_owner') {
            const merchant = await Merchant.findOne({ owner: req.user.id });
            if (!merchant || product.merchant.toString() !== merchant._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this product',
                });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins and store owners can update products',
            });
        }

        // Validate price if provided
        if (price !== undefined && price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative',
            });
        }

        // Validate stock if provided
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative',
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (stock !== undefined) updateData.stock = stock;
        if (category !== undefined) updateData.category = category;
        if (images !== undefined) updateData.images = images;

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate('merchant', 'name logo');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: formatProduct(updatedProduct),
        });
    } catch (error) {
        console.error('❌ Update Product Error:', error);

        // Handle invalid MongoDB ID
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
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
            message: 'Error updating product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private - Admin or Product Owner (Store Owner)
 */
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check authorization: Only admin or product's merchant can delete
        if (req.user.role === 'store_owner') {
            const merchant = await Merchant.findOne({ owner: req.user.id });
            if (!merchant || product.merchant.toString() !== merchant._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this product',
                });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins and store owners can delete products',
            });
        }

        // Delete product
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('❌ Delete Product Error:', error);

        // Handle invalid MongoDB ID
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * pageSize;

        // Get total count
        const total = await Product.countDocuments({ category });
        const totalPages = Math.ceil(total / pageSize);

        // Fetch products
        const products = await Product.find({ category })
            .populate('merchant', 'name logo')
            .skip(skip)
            .limit(pageSize)
            .lean();

        res.status(200).json({
            success: true,
            category,
            count: products.length,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages,
            },
            data: products.map(formatProduct),
        });
    } catch (error) {
        console.error('❌ Get Products By Category Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   GET /api/products/merchant/:merchantId
 * @desc    Get all products for a specific merchant
 * @access  Public
 */
exports.getProductsByMerchant = async (req, res, next) => {
    try {
        const { merchantId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Calculate pagination
        const pageNum = Math.max(1, parseInt(page));
        const pageSize = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * pageSize;

        // Get total count
        const total = await Product.countDocuments({ merchant: merchantId });
        const totalPages = Math.ceil(total / pageSize);

        // Fetch products
        const products = await Product.find({ merchant: merchantId })
            .populate('merchant', 'name logo email')
            .skip(skip)
            .limit(pageSize)
            .lean();

        res.status(200).json({
            success: true,
            merchantId,
            count: products.length,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages,
            },
            data: products.map(formatProduct),
        });
    } catch (error) {
        console.error('❌ Get Products By Merchant Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products by merchant',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

/**
 * @route   PUT /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private - Admin or Product Owner (Store Owner)
 */
exports.updateProductStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'

        // Validate required fields
        if (quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide quantity',
            });
        }

        // Find product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check authorization
        if (req.user.role === 'store_owner') {
            const merchant = await Merchant.findOne({ owner: req.user.id });
            if (!merchant || product.merchant.toString() !== merchant._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this product',
                });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins and store owners can update stock',
            });
        }

        // Update stock based on operation
        let newStock = product.stock;
        switch (operation) {
            case 'set':
                newStock = quantity;
                break;
            case 'add':
                newStock = product.stock + quantity;
                break;
            case 'subtract':
                newStock = product.stock - quantity;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Operation must be 'set', 'add', or 'subtract'",
                });
        }

        // Validate new stock
        if (newStock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative',
            });
        }

        // Update stock
        product.stock = newStock;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product stock updated successfully',
            data: {
                id: product._id,
                previousStock: product.stock,
                newStock: newStock,
                operation,
            },
        });
    } catch (error) {
        console.error('❌ Update Product Stock Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating product stock',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};
