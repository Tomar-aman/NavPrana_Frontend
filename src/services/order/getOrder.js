import API from "../api";

export const getOrderAPI = async (page) => {
  const res = await API.get(`api/v1/order/my-orders/?page=${page}&size=10`);

  return res;
};
