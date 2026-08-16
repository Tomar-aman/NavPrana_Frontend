import API from "../api";

/**
 * Create (or reuse) a lightweight guest account from the details typed at
 * checkout and receive JWT tokens for the rest of the flow.
 *
 * Throws with `code === "account_exists"` when the email/phone belongs to a
 * real registered account — that customer must sign in instead.
 */
export const guestCheckoutAPI = async (payload) => {
  const res = await API.post("api/v1/user/guest-checkout/", payload);
  return res.data;
};
