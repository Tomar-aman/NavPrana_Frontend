import API from "../api";

export const couponApplyAPI = async (couponField) => {
  const res = await API.post("api/v1/coupon/apply/", couponField);
  return res.data;
};
