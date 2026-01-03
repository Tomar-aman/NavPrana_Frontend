import API from "@/services/api";

export const signUp = async (data) => {
  const res = await API.post("api/v1/user/signup/", data);
  return res.data;
};
