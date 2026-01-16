import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// 🔐 Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⚠️ IMPORTANT:
    // If FormData is used, let browser set content-type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
