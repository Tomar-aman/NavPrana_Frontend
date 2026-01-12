import API from "../api";

export const getProduct = async () => {
  const res = await API.get("api/v1/product/products/");
  return res.data;
};
