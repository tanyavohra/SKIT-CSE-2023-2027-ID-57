// src/api/authApi.js
import axiosClient from "./axiosClient";

// Adjust these endpoint paths to match your actual backend routes.

export async function loginUser(email, password) {
  const { data } = await axiosClient.post("/auth/login", { email, password });
  return data; // expected shape: { token, user }
}

export async function registerUser(fullName, email, password) {
  const { data } = await axiosClient.post("/auth/register", {
    fullName,
    email,
    password,
  });
  return data; // expected shape: { token, user }
}

export async function getCurrentUser() {
  const { data } = await axiosClient.get("/auth/me");
  return data; // expected shape: { user }
}

export async function logoutUser() {
  // Optional: only needed if your backend invalidates sessions/refresh tokens server-side.
  // If your auth is purely stateless JWT, you can skip the request and just clear local storage.
  await axiosClient.post("/auth/logout");
}