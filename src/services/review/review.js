import API from "../api";

export const addReviewAPI = async (data) => {
  try {
    const res = await API.post(`/api/v1/product/reviews/`, data);
    return res.data;
  } catch (err) {
    console.error("Error adding review:", err);
  }
};

export const updateReviewAPI = async (id, data) => {
  const res = await API.put(`/api/v1/product/reviews/${id}/`, { data });
  return res.data;
};

export const getReviewAPI = async () => {
  const res = await API.get(`/api/v1/product/reviews/`);
  return res.data;
};
