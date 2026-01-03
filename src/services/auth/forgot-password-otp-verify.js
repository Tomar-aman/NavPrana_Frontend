import API from "@/services/api";

export const forgotPasswordOTPVerify = async (data) => {
  const res = await API.post("api/v1/user/forgot-password-otp-verify/", data);
  return res.data;
};
