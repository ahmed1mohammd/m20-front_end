import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically if available in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('elan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Settings
export const getPublicSettings = async () => {
  try {
    const res = await API.get('/settings/public');
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching public settings:', err);
    return null;
  }
};

// Homepage
export const getHomepageData = async () => {
  try {
    const res = await API.get('/home');
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return null;
  }
};

// Catalog
export const getProducts = async (params = {}) => {
  try {
    const res = await API.get('/products', { params });
    return res.data?.data?.products || res.data?.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return null;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const res = await API.get(`/products/slug/${slug}`);
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return null;
  }
};

// Orders & Shipping
export const getShippingQuote = async ({ deliveryMethod, governorate, city, subtotal, couponCode }) => {
  try {
    const res = await API.post('/orders/shipping-quote', { 
      deliveryMethod, 
      governorate, 
      city, 
      subtotal,
      couponCode 
    });
    return res.data?.data || null;
  } catch (err) {
    console.error('Error getting shipping quote:', err);
    return null;
  }
};

// Coupons & Promo Codes
export const validateCouponCode = async (code, cartTotal, shippingFee = 0) => {
  const res = await API.post('/coupons/validate', {
    code: code.trim(),
    cartTotal,
    shippingFee
  });
  return res.data?.data || res.data;
};

export const createOrder = async (orderData) => {
  try {
    const res = await API.post('/orders', orderData);
    return res.data?.data || null;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

// Track Order (Public by Order ID or Phone)
export const trackOrder = async (query) => {
  try {
    const res = await API.get(`/orders/track/${encodeURIComponent(query.trim())}`);
    return res.data?.data || [];
  } catch (err) {
    console.error('Error tracking order:', err);
    throw err;
  }
};

// User My Orders
export const getMyOrders = async (params = {}) => {
  try {
    const res = await API.get('/orders/my-orders', { params });
    return res.data?.data || { orders: [], pagination: {} };
  } catch (err) {
    console.error('Error fetching my orders:', err);
    return { orders: [], pagination: {} };
  }
};

// Auth APIs
export const requestEmailOtp = async ({ email, name }) => {
  const res = await API.post('/auth/request-otp', { email, name });
  return res.data?.data;
};

export const registerUser = async ({ name, phone, email, password }) => {
  const res = await API.post('/auth/register', { name, phone, email, password });
  return res.data?.data;
};

export const loginUser = async ({ identifier, phone, email, password }) => {
  const res = await API.post('/auth/login', { identifier, phone, email, password });
  return res.data?.data;
};

export const verifyEmailOtp = async ({ email, phone, otp }) => {
  const res = await API.post('/auth/verify-otp', { email, phone, otp });
  return res.data?.data;
};

export const resendEmailOtp = async ({ email, phone }) => {
  const res = await API.post('/auth/resend-otp', { email, phone });
  return res.data?.data;
};

export const getMe = async () => {
  try {
    const res = await API.get('/auth/me');
    return res.data?.data || null;
  } catch (err) {
    return null;
  }
};

// Offers
export const getActiveOffers = async () => {
  try {
    const res = await API.get('/offers/active');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching active offers:', err);
    return [];
  }
};

// Checkout Payment Proof Upload -> Cloudinary (m20/receipts)
export const uploadPaymentProof = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await API.post('/cloudinary/upload-proof', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data?.data || res.data;
};

export default API;

