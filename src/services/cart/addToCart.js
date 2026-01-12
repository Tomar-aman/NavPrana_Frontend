import API from "../api";

export const addToCartAPI = async ({ product, quantity }) => {
  console.log(product, quantity);
  const res = await API.post("api/v1/cart/", { product, quantity });
  return res.data;
};
