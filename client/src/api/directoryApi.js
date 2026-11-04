// src/api/directoryApi.js
import axiosClient from "./axiosClient";

// GET /api/profile/directory
// params: { search, education, company, city, role, page, limit }
// -> { alumni: [profile...], pagination: { total, page, limit, totalPages } }
export async function searchDirectory(params = {}, signal) {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    const v = typeof value === "string" ? value.trim() : value;
    if (v !== undefined && v !== null && v !== "") clean[key] = v;
  });
  const { data } = await axiosClient.get("/profile/directory", { params: clean, signal });
  return data;
}

// Builds ?search=...&education=...&company=...&city=... for the /directory page URL.
export function buildSearchParams(query, filters = {}, page) {
  const params = new URLSearchParams();
  const put = (key, value) => {
    const v = typeof value === "string" ? value.trim() : value;
    if (v) params.set(key, String(v));
  };
  put("search", query);
  put("education", filters.education);
  put("company", filters.company);
  put("city", filters.city);
  if (page && page > 1) params.set("page", String(page));
  return params;
}