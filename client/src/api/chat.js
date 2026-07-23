import { axiosInstance } from "./index";

export const StartConversation = async (vehicleId) => {
  try {
    const response = await axiosInstance.post("/chat/start", { vehicleId });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const SendMessage = async (conversationId, text) => {
  try {
    const response = await axiosInstance.post("/chat/message", { conversationId, text });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetMyConversations = async () => {
  try {
    const response = await axiosInstance.get("/chat/conversations");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetMessages = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chat/${conversationId}/messages`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
