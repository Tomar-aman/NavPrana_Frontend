import API from "@/services/api";

export const resendVerifyApi = async (data) => {
  const res = await API.post("api/v1/user/resend-otp/", data);
  return res.data;
};
