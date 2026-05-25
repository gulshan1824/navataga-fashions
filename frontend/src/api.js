const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const proxyImage = (url) =>
  url ? `${BASE_URL}/proxy-image?url=${encodeURIComponent(url)}` : null;

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const getProducts = async (search = '', category = '') => {
  let url = `${BASE_URL}/products?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (category && category !== 'All') url += `category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return handleResponse(res);
};

export const createProduct = async (data) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const syncSheet = async () => {
  const res = await fetch(`${BASE_URL}/sync-sheet`, {
    method: 'POST',
  });
  return handleResponse(res);
};
