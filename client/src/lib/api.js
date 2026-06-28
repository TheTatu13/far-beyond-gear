import axios from "axios";

// În dev: Vite proxy trimite /api → localhost:8000
// În producție: VITE_API_BASE_URL=https://far-beyond-gear-api.onrender.com
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "/api"
});

function unwrapList(response) {
  if (!response || !response.data) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export async function getBrands() {
  const res = await api.get("/brands/", { params: { page_size: 100 } });
  return unwrapList(res);
}

export async function getBrand(id) {
  if (!id) throw new Error("id brand lipsă");
  const res = await api.get(`/brands/${id}/`);
  return res.data;
}

export async function getCategories() {
  const res = await api.get("/categories/");
  return unwrapList(res);
}

export async function getProducts(params = {}) {
  const res = await api.get("/products/", { params });
  return unwrapList(res);
}

export async function getProduct(id) {
  if (!id) throw new Error("id produs lipsă");
  const res = await api.get(`/products/${id}/`);
  return res.data;
}

export async function getArtists(params = {}) {
  const res = await api.get("/artists/", { params: { page_size: 100, ...params } });
  return unwrapList(res);
}

export async function getArtist(id) {
  if (!id) throw new Error("id artist lipsă");
  const res = await api.get(`/artists/${id}/`);
  return res.data;
}

export async function getProductReviews(id) {
  if (!id) throw new Error("id produs lipsă");
  const res = await api.get(`/products/${id}/reviews/`);
  return unwrapList(res);
}

export async function postProductReview(id, data, token) {
  if (!id) throw new Error("id produs lipsă");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.post(`/products/${id}/reviews/`, data, config);
  return res.data;
}

export async function grantAchievement(name, token) {
  if (!token) return; // Achievement-uri doar pentru logați
  try {
    const res = await api.post("/achievements/grant/", { achievement_name: name }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("Achievement grant error:", err);
  }
}
