import { axiosInstance } from "./index";

export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/register", payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/login", payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/users/get-current-user");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const ForgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/users/forgot-password", { email });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const ResetPassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/reset-password", payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const UpdateMyProfile = async (payload) => {
  try {
    const response = await axiosInstance.put("/users/me", payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetPublicProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/profile`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
