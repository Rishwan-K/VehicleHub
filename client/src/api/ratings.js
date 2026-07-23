import { axiosInstance } from "./index";

export const SubmitRating = async (ratedUserId, stars, comment, vehicleId) => {
  try {
    const response = await axiosInstance.post("/ratings", { ratedUserId, stars, comment, vehicleId });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};

export const GetRatingsForUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/ratings/user/${userId}`);
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
