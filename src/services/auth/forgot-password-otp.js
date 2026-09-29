import API from "@/services/api";

// { email } sends the code by email, { phone_number } on WhatsApp.
export const forgotPasswordOTP = async (data) => {
  const res = await API.post("api/v1/user/forgot-password-otp/", data);
  return res.data;
};
