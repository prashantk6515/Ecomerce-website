const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Protected customer route: Add review
router.post(
  '/:id/reviews',
  [
    protect,
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
    validate,
  ],
  createProductReview
);

// Admin-only management routes
router.post(
  '/',
  [
    protect,
    adminOnly,
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a valid positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate,
  ],
  createProduct
);

router.put('/:id', [protect, adminOnly], updateProduct);
router.delete('/:id', [protect, adminOnly], deleteProduct);

module.exports = router;
