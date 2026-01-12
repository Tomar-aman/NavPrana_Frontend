import API from "../api";

export const sendAddress = async (data) => {
  const res = await API.post("api/v1/user/addresses/", data);
  return res.data;
};
