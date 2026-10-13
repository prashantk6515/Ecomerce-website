import { apiClient } from './client';

export const productApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.minPrice) query.set('minPrice', params.minPrice);
    if (params.maxPrice) query.set('maxPrice', params.maxPrice);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);

    const qs = query.toString();
    return apiClient(`/products${qs ? `?${qs}` : ''}`);
  },

  getCategories: () => apiClient('/products/categories'),

  getFeatured: () => apiClient('/products/featured'),

  getProductById: (id) => apiClient(`/products/${id}`),

  createReview: (id, reviewData) =>
    apiClient(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // Admin endpoints
  createProduct: (productData) =>
    apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    apiClient(`/products/${id}`, {
      method: 'DELETE',
    }),
};
