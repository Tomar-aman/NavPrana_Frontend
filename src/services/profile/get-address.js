import API from "../api";

export const getAddress = async () => {
  const res = await API.get("api/v1/user/addresses/");
  return res.data;
};
