import API from "../api";

export const getCartAPI = async () => {
  const res = await API("api/v1/cart/");
  return res.data;
};
