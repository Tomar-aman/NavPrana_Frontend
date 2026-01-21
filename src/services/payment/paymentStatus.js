import API from "../api";

export const paymentStatusAPI = async (payload) => {
  console.log("Calling paymentStatusAPI with payload:", payload);
  const res = await API.get(`api/v1/transaction/cashfree/status/${payload}/`);
  console.log("paymentStatusAPI response data:", res.data);
  return res.data;
};
