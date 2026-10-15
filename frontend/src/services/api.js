// BOSS N BUZZ ORIGINALS - API Client (Local & Cloud HTTPS Ready)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export function getFullImageUrl(path) {
  if (!path) return '/bnb-monogram.svg';
  if (path.startsWith('http')) return path;
  
  const backendBase = import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') : '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (backendBase) {
    return `${backendBase}${cleanPath}`;
  }
  return cleanPath;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('bnb_admin_token');

  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}: Request failed`);
    }
    return data;
  } catch (err) {
    console.error('API Error:', endpoint, err);
    throw err;
  }
}

export const api = {
  // Public
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`);
  },
  getProductBySlug: (slug) => request(`/products/${slug}`),
  getFeaturedProducts: () => request('/featured'),
  getSettings: () => request('/settings'),
  submitLead: (leadData) => request('/leads', {
    method: 'POST',
    body: JSON.stringify(leadData)
  }),
  createOrder: (orderData) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  submitUtr: (utrData) => request('/orders/submit-utr', {
    method: 'POST',
    body: JSON.stringify(utrData)
  }),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),
  trackOrder: (query) => request(`/orders/track?query=${encodeURIComponent(query)}`),

  // Admin
  login: (credentials) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  checkSession: () => request('/admin/check-session'),
  logout: () => request('/admin/logout', { method: 'POST' }),
  getStats: () => request('/admin/stats'),
  uploadImage: (formData) => request('/admin/upload', {
    method: 'POST',
    body: formData
  }),
  getAdminProducts: () => request('/admin/products'),
  createProduct: (prod) => request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(prod)
  }),
  updateProduct: (id, prod) => request(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(prod)
  }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  toggleFeatured: (id) => request(`/admin/products/${id}/toggle-featured`, { method: 'POST' }),
  getAdminLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/leads${query ? '?' + query : ''}`);
  },
  updateLeadStatus: (id, data) => request(`/admin/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteLead: (id) => request(`/admin/leads/${id}`, { method: 'DELETE' }),
  getAdminOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/orders${query ? '?' + query : ''}`);
  },
  updateOrderStatus: (id, data) => request(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  updateSettings: (settingsData) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData)
  }),
  changePassword: (data) => request('/admin/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};
