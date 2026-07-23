import { axiosInstance } from "./index";

export const AdminListAllVehicles = async () => {
  try {
    const response = await axiosInstance.get("/admin/vehicles");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const AdminRemoveVehicle = async (id) => {
  try {
    const response = await axiosInstance.patch(`/admin/vehicles/${id}/remove`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const AdminListUsers = async () => {
  try {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const AdminSetUserBlocked = async (id, blocked) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}/block`, { blocked });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
