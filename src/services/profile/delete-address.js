import API from "../api";

export const deleteAddresses = async (id) => {
  const res = await API.delete(`/api/v1/user/addresses/${id}/`);

  return res.data;
};
