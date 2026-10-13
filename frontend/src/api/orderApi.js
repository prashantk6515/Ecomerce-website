import { apiClient } from './client';

export const orderApi = {
  createOrder: (orderData) =>
    apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () => apiClient('/orders/my-orders'),

  getOrderById: (id) => apiClient(`/orders/${id}`),

  // Payments
  getStripeConfig: () => apiClient('/payments/config'),

  createPaymentIntent: (orderId) =>
    apiClient('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),

  verifyPayment: (paymentData) =>
    apiClient('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Admin
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    const qs = query.toString();
    return apiClient(`/orders/admin/all${qs ? `?${qs}` : ''}`);
  },

  getAdminStats: () => apiClient('/orders/admin/stats'),

  updateOrderStatus: (id, status) =>
    apiClient(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
