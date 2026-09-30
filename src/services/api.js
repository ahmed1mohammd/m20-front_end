import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHomepageData = async () => {
  try {
    const res = await API.get('/home');
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    return null;
  }
};

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

export const getShippingQuote = async ({ deliveryMethod, governorate, city, subtotal }) => {
  try {
    const res = await API.post('/orders/shipping-quote', { deliveryMethod, governorate, city, subtotal });
    return res.data?.data || null;
  } catch (err) {
    console.error('Error getting shipping quote:', err);
    return null;
  }
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

export default API;
