import API from "@/services/api";

export const verifyAPI = async (data) => {
  const res = await API.post("api/v1/user/verify-otp/", data);
  return res.data;
};
