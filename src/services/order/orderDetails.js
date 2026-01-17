import API from "../api";

export const orderDetailAPI = async (id) => {
  const res = await API.get(`api/v1/order/${id}/`);
  return res.data; // ✅ return only data
};
