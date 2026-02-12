import API from "@/services/api";

export const createOrderAPI = async (payload) => {
  const res = await API.post(
    "api/v1/transaction/cashfree/create-order/",
    payload
  );
  return res.data;
};
