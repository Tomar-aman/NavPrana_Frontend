// import axios from "axios";
// import { getAuthToken } from "@/utils/authToken";

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

// // 🔐 Attach token automatically
// API.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // ⚠️ IMPORTANT:
//     // If FormData is used, let browser set content-type
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     } else {
//       config.headers["Content-Type"] = "application/json";
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;

// import axios from "axios";
// import { getAuthToken } from "@/utils/authToken";
// import { hideLoader, showLoader } from "@/redux/features/uiSlice";
// import { store } from "@/redux/store";

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

// // 🔐 Attach token automatically + loader
// API.interceptors.request.use(
//   (config) => {
//     store.dispatch(showLoader()); // 🔥 SHOW LOADER

//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // ✅ Handle JSON vs FormData correctly
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     } else {
//       config.headers["Content-Type"] = "application/json";
//     }

//     return config;
//   },
//   (error) => {
//     store.dispatch(hideLoader());
//     return Promise.reject(error);
//   }
// );

// // 🔽 Hide loader after response
// API.interceptors.response.use(
//   (response) => {
//     store.dispatch(hideLoader()); // 🔥 HIDE LOADER
//     return response;
//   },
//   (error) => {
//     store.dispatch(hideLoader()); // 🔥 HIDE LOADER
//     return Promise.reject(error);
//   }
// );

// export default API;

import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default API;
