import API from "@/services/api";

export const forgotPassword = async (data) => {
  const res = await API.post("api/v1/user/forgot-password-reset/", data);
  return res.data;
};
