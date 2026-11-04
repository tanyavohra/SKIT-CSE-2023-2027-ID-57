import axiosClient from "./axiosClient";

export const CONNECTION_STATUS = {
  NONE: "none",
  PENDING_SENT: "pending_sent",
  PENDING_RECEIVED: "pending_received",
  CONNECTED: "connected",
  BLOCKED: "blocked",
};

export async function getConnectionStatus(userId) {
  const { data } = await axiosClient.get(`/connections/status/${userId}`);
  return data.status || CONNECTION_STATUS.NONE;
}

export async function getConnectionsCount(userId) {
  const { data } = await axiosClient.get(`/connections/count/${userId}`);
  return Number(data.count) || 0;
}

export async function sendConnectionRequest(userId) {
  await axiosClient.post(`/connections/${userId}/request`);
}

export async function cancelConnectionRequest(userId) {
  await axiosClient.delete(`/connections/${userId}/request`);
}

export async function acceptConnectionRequest(userId) {
  await axiosClient.post(`/connections/${userId}/accept`);
}

export async function declineConnectionRequest(userId) {
  await axiosClient.post(`/connections/${userId}/decline`);
}

export async function disconnectFrom(userId) {
  await axiosClient.delete(`/connections/${userId}`);
}

export async function blockUser(userId) {
  await axiosClient.post(`/connections/${userId}/block`);
}

export async function unblockUser(userId) {
  await axiosClient.delete(`/connections/${userId}/block`);
}
