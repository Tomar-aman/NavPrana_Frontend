import API from "@/services/api";

export const googleAuthApi = async (token) => {
  const res = await API.post("api/v1/user/google-auth/", { token });
  return res.data;
};
