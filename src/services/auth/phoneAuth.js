import API from "@/services/api";

/**
 * Trade a Firebase phone ID token for our own JWT pair. Creates a phone-only
 * account when the number has never been seen before.
 */
export const phoneAuthApi = async (idToken) => {
  const res = await API.post("api/v1/user/firebase-phone-auth/", {
    firebase_id_token: idToken,
  });
  return res.data;
};

/** Attach a verified number to the account that is already signed in. */
export const verifyPhoneApi = async (idToken) => {
  const res = await API.post("api/v1/user/verify-phone/", {
    firebase_id_token: idToken,
  });
  return res.data;
};
