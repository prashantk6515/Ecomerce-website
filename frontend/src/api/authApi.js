import { apiClient } from './client';

export const authApi = {
  login: (credentials) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiClient('/auth/profile'),

  updateProfile: (data) =>
    apiClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
