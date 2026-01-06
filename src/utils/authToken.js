import Cookies from "js-cookie";

const TOKEN_KEY = "access_token";

// Save token
export const setAuthToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

// Get token
export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

// Remove token (logout)
export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};
