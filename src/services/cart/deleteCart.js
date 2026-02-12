import API from "../api";

export const deleteCartAPI = async (id) => {
  const res = await API.delete(`api/v1/cart/${id}/`);
  return res.data;
};
