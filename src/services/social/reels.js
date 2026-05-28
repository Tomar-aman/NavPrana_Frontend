import API from "../api";

/**
 * Fetch active Instagram reels from backend
 * GET /api/v1/public/reels/
 */
export const getInstagramReels = async () => {
  const res = await API.get("/api/v1/public/reels/");
  return res.data?.results || res.data;
};
