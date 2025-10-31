const express = require('express');
const router = express.Router();
const {
    getAllMerchants,
    getMerchantById,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    getMerchantProducts,
    changeMerchantPassword,
} = require('../controllers/merchantController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Merchant:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: Merchant ID
 *         name:
 *           type: string
 *           description: Merchant name
 *         email:
 *           type: string
 *           description: Merchant email
 *         phone:
 *           type: string
 *           description: Merchant phone number
 *         address:
 *           type: string
 *           description: Merchant address
 *         companyName:
 *           type: string
 *           description: Company name
 *         companyId:
 *           type: string
 *           description: Company registration ID
 *         nationalId:
 *           type: string
 *           description: National ID
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         name: "Fashion Store"
 *         email: "contact@fashionstore.com"
 *         phone: "+1234567890"
 *         address: "123 Fashion Street, NY"
 *         companyName: "Fashion Store LLC"
 *         companyId: "FS123456"
 *         nationalId: "NID987654"
 *         products: []
 *         createdAt: "2025-01-15T10:00:00.000Z"
 *         updatedAt: "2025-01-15T10:00:00.000Z"
 *
 *     MerchantResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Merchant'
 *
 *     MerchantsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         count:
 *           type: integer
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Merchant'
 */

/**
 * @swagger
 * /api/merchants:
 *   get:
 *     summary: Get all merchants
 *     tags: [Merchants]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, company name, or email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page (max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field (prefix with - for descending)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantsResponse'
 *       500:
 *         description: Server error
 */
router.get('/', getAllMerchants);

/**
 * @swagger
 * /api/merchants/{id}:
 *   get:
 *     summary: Get a single merchant by ID
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantResponse'
 *       404:
 *         description: Merchant not found
 *       400:
 *         description: Invalid merchant ID format
 *       500:
 *         description: Server error
 */
router.get('/:id', getMerchantById);

/**
 * @swagger
 * /api/merchants:
 *   post:
 *     summary: Create a new merchant (Admin only)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fashion Store"
 *               email:
 *                 type: string
 *                 example: "contact@fashionstore.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Fashion Street, NY"
 *               companyName:
 *                 type: string
 *                 example: "Fashion Store LLC"
 *               companyId:
 *                 type: string
 *                 example: "FS123456"
 *               nationalId:
 *                 type: string
 *                 example: "NID987654"
 *     responses:
 *       201:
 *         description: Merchant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantResponse'
 *       400:
 *         description: Validation error or merchant already exists
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       500:
 *         description: Server error
 */
router.post('/', protect, authorize('admin'), createMerchant);

/**
 * @swagger
 * /api/merchants/{id}:
 *   put:
 *     summary: Update a merchant (Admin or merchant owner)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyId:
 *                 type: string
 *               nationalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Merchant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MerchantResponse'
 *       400:
 *         description: Validation error or invalid merchant ID
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, authorize('admin', 'store_owner'), updateMerchant);

/**
 * @swagger
 * /api/merchants/{id}:
 *   delete:
 *     summary: Delete a merchant (Admin only)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Merchant deleted successfully
 *       400:
 *         description: Invalid merchant ID format
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, authorize('admin'), deleteMerchant);

/**
 * @swagger
 * /api/merchants/{id}/products:
 *   get:
 *     summary: Get all products for a specific merchant
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 merchantId:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Merchant not found
 *       400:
 *         description: Invalid merchant ID format
 *       500:
 *         description: Server error
 */
router.get('/:id/products', getMerchantProducts);

/**
 * @swagger
 * /api/merchants/{id}/change-password:
 *   put:
 *     summary: Change merchant password (Admin or merchant owner)
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error or invalid merchant ID
 *       401:
 *         description: Not authenticated or current password incorrect
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Server error
 */
router.put('/:id/change-password', protect, authorize('admin', 'store_owner'), changeMerchantPassword);

module.exports = router;
