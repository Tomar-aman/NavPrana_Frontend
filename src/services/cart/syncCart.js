import API from "../api";

/** Push locally-held guest cart rows onto the signed-in account. */
export const syncCartAPI = async (items) => {
  const res = await API.post("api/v1/cart/sync/", { items });
  return res.data;
};
