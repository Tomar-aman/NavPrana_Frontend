import API from "../api";

export const deleteAddresses = async (id) => {
  console.log(id);
  const res = await API.delete(`/api/v1/user/addresses/${id}/`);

  return res.data;
};
