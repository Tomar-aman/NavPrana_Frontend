import { getAuthToken } from "@/utils/authToken";
import axios from "axios";

const token = getAuthToken();
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default API;
