
import axiosClient from "./axiosClient";

export async function loginUser(email, password) {
  const { data } = await axiosClient.post("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerUser(fullName, email, password, role) {
  const { data } = await axiosClient.post("/auth/register", {
    fullName,
    email,
    password,
    role,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await axiosClient.get("/auth/me");
  return data;
}

export async function logoutUser() {
  await axiosClient.post("/auth/logout");
}
