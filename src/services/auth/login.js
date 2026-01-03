import API from "@/services/api";

export const loginApi = async (data) => {
  console.log(API);
  const res = await API.post("api/v1/user/login/", data);
  return res.data;
};
