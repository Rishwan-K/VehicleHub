import { axiosInstance } from "./index";

// files: array of File objects from an <input type="file" multiple>
export const UploadImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await axiosInstance.post("/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    return err.response?.data;
  }
};
