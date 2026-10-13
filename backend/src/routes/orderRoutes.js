const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer endpoints
router.route('/').post(protect, createOrder);
router.route('/my-orders').get(protect, getMyOrders);

// Admin endpoints
router.route('/admin/all').get(protect, adminOnly, getAllOrders);
router.route('/admin/stats').get(protect, adminOnly, getAdminStats);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);

// Individual order query (customer owner or admin)
router.route('/:id').get(protect, getOrderById);

module.exports = router;
