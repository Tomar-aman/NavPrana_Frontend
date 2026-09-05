import API from "../api";

/**
 * The COD handling fee, delivery charges and prepaid discount currently in
 * force, as set in the Django admin under Pricing Settings.
 *
 * Public endpoint — no token needed, and it is safe to call before sign-in.
 */
export const getPricingAPI = async () => {
  const res = await API.get("api/v1/public/pricing/");
  return res.data;
};
