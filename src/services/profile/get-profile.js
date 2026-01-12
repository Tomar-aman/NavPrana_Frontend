import API from "../api";

export const getProfileAPI = async () => {
  const res = await API.get("api/v1/user/profile/");
  return res.data;
};
