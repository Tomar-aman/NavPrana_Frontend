import axios from "axios";
import { getAuthToken } from "@/utils/authToken";
import { normalizeApiError } from "./httpError";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Normalize errors so callers get consistent objects
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, clear token and redirect to home
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        const { removeAuthToken } = require("@/utils/authToken");
        removeAuthToken();
        window.location.href = "/";
      }
    }
    return Promise.reject(normalizeApiError(error));
  }
);

export default API;
