
import axiosClient from "./axiosClient";

// GET /api/profile
export async function getMyProfile() {
  try {
    const { data } = await axiosClient.get("/profile");

    return {
      user: data.user || {},
      profile: data.profile || {},
    };
  } catch (err) {
    if (err?.response?.status === 404) {
      return {
        user: {},
        profile: {},
      };
    }
    throw err;
  }
}

// PUT /api/profile
export async function updateMyProfile(payload) {
  const { data } = await axiosClient.put("/profile", payload);

  return {
    user: data.user || {},
    profile: data.profile || {},
  };
}

// GET /api/profile/user/:id
export async function getProfileById(userId) {
  const { data } = await axiosClient.get(`/profile/user/${userId}`);
  return data;
}

// POST /api/profile/picture
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("picture", file);

  const { data } = await axiosClient.post(
    "/profile/picture",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.profilePicture;
}

// DELETE /api/auth/me
export async function deleteMyAccount() {
  await axiosClient.delete("/auth/me");
}
