import { axiosInstance } from "./index";

export const SearchVehicles = async (params) => {
  try {
    const response = await axiosInstance.get("/vehicles/search", { params });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetVehicleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const CreateListing = async (payload) => {
  try {
    const response = await axiosInstance.post("/vehicles", payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const UpdateListing = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/vehicles/${id}`, payload);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const MarkAsSold = async (id) => {
  try {
    const response = await axiosInstance.patch(`/vehicles/${id}/sold`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const DeleteListing = async (id) => {
  try {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetLocations = async () => {
  try {
    const response = await axiosInstance.get("/vehicles/locations");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetMyListings = async () => {
  try {
    const response = await axiosInstance.get("/vehicles/mine/all");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
