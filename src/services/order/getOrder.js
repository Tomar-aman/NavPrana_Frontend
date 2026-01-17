import API from "../api";

export const getOrderAPI = async () => {
  const res = await API.get("api/v1/order/my-orders/");
  console.log(res.data);
  return res.data;
};
