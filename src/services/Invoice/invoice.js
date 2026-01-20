import API from "../api";

export const inVoiceApi = async (id) => {
  const res = await API.get(`api/v1/order/${id}/invoice/`);
  return res.data;
};
