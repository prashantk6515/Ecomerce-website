const express = require('express');
const {
  getStripeConfig,
  createPaymentIntent,
  verifyPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/verify', protect, verifyPayment);

module.exports = router;
