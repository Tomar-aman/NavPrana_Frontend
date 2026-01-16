import API from "@/services/api";

export const createOrderAPI = async (payload) => {
  console.log(payload);
  const res = await API.post(
    "api/v1/transaction/cashfree/create-order/",
    payload
  );
  console.log(res.data);
  return res.data;
};
