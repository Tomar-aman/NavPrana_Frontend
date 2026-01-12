import API from "../api";

export const updateCartAPI = (id, data) => {
  return API.patch(`/api/v1/cart/${id}/`, data);
};
