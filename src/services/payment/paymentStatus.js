import API from "../api";

export const paymentStatusAPI = async (payload) => {
  console.log(payload);
  const res = await API.get(`api/v1/transaction/cashfree/status/${payload}/`);
  return res.data;
};
