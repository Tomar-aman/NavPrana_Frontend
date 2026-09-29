import API from "@/services/api";

// WhatsApp OTPs. Login works signed out; verification is for the signed-in
// user and is what lets them place a Cash on Delivery order.

export const sendLoginOtpApi = async (phone_number) => {
  const res = await API.post("api/v1/user/otp-login/send/", { phone_number });
  return res.data;
};

// Returns { needs_details: true } for a number with no account yet; send the
// same code again with first_name/last_name/email to create it.
export const verifyLoginOtpApi = async (data) => {
  const res = await API.post("api/v1/user/otp-login/verify/", data);
  return res.data;
};

export const sendPhoneVerificationApi = async (phone_number) => {
  const res = await API.post("api/v1/user/phone-verification/send/", { phone_number });
  return res.data;
};

export const verifyPhoneApi = async (phone_number, otp) => {
  const res = await API.post("api/v1/user/phone-verification/verify/", { phone_number, otp });
  return res.data;
};

/** The message the backend put on an OTP error, for a toast. */
export const otpErrorMessage = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;
  return (
    data?.message ||
    data?.otp?.[0] ||
    data?.phone_number?.[0] ||
    data?.email?.[0] ||
    fallback
  );
};
