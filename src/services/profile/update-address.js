import API from "../api";

export const updateAddress = async (id, data) => {
  console.log("Updating Address ID:", id, "with Data:", data);
  const res = await API.patch(`/api/v1/user/addresses/${id}/`, data);
  return res.data;
};
