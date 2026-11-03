// src/api/profileApi.js
import axiosClient from "./axiosClient";

// GET /api/profile  (exists). 404 just means "no profile created yet".
export async function getMyProfile() {
  try {
    const { data } = await axiosClient.get("/profile");
    return data.profile || {};
  } catch (err) {
    if (err?.response?.status === 404) return {};
    throw err;
  }
}

// PUT /api/profile  (exists, but only saves the fields its handler lists)
export async function updateMyProfile(payload) {
  const { data } = await axiosClient.put("/profile", payload);
  return data.profile || {};
}

// GET /api/profile/user/:id  (NEW) -> { user: { id, fullName, role }, profile }
export async function getProfileById(userId) {
  const { data } = await axiosClient.get(`/profile/user/${userId}`);
  return data;
}

// POST /api/profile/picture  (NEW, multipart field "picture") -> { profilePicture }
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("picture", file);
  const { data } = await axiosClient.post("/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.profilePicture;
}

// DELETE /api/auth/me  (NEW) -> deletes the user and their profile
export async function deleteMyAccount() {
  await axiosClient.delete("/auth/me");
}
