import API from "../api";

export const editProfile = async (data) => {
  const res = await API.patch("api/v1/user/profile/", data);
  return res.data;
};
