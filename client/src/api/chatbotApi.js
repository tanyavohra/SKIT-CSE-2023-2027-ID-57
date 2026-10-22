import axiosClient from "./axiosClient";

export async function sendCareerChat(messages) {
  const { data } = await axiosClient.post("/chatbot/chat", { messages });
  return data.reply;
}
