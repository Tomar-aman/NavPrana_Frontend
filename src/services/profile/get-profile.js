import API from "../api";

export const getProfile = async () => {
  const res = await API.get("api/v1/user/profile/");
  return res.data;
};
