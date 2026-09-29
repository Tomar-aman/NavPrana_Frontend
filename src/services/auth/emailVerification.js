import API from "@/services/api";

// Profile-page email verification for the signed-in user. Signup no longer
// waits on an OTP, so this is the only place the email gets verified.
export const sendEmailVerificationApi = async () => {
  const res = await API.post("api/v1/user/email-verification/send/");
  return res.data;
};

export const verifyEmailApi = async (otp) => {
  const res = await API.post("api/v1/user/email-verification/verify/", { otp });
  return res.data;
};
