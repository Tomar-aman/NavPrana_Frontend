import API from "../api";

export const changePassword = async (data) => {
  const res = await API.post("api/v1/user/change-password/", data);
  return res.data;
};
