const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Registration route
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  registerUser
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  loginUser
);

// Profile routes (Protected)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(
    protect,
    [
      body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
      body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
      body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      validate,
    ],
    updateUserProfile
  );

module.exports = router;
