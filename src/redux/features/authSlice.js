import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "@/services/auth/login";
import { signUp } from "@/services/auth/signUp";
import { verifyAPI } from "@/services/auth/verifyOTP";
import { googleAuthApi } from "@/services/auth/googleAuth";
import { setAuthToken, removeAuthToken, getAuthToken } from "@/utils/authToken";

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);

      // Save token (cookie / localStorage)
      setAuthToken(res.access);

      return res;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

/* ================= SIGNUP ================= */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      return await signUp(data);
    } catch (err) {
      const errData = err?.response?.data;

      // Pass field-level errors or message from API
      if (errData && typeof errData === "object") {
        return rejectWithValue(errData);
      }

      return rejectWithValue(errData?.message || "Signup failed");
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await verifyAPI(payload);
      setAuthToken(res.access);
      return res;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "OTP verification failed";
      return rejectWithValue(msg);
    }
  }
);

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const res = await googleAuthApi(token);
      setAuthToken(res.access);
      return res;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Google login failed";
      return rejectWithValue(msg);
    }
  }
);

/* ================= AUTH SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // user profile
    token: null, // access token
    isAuthenticated: false, // auth flag
    loading: false,
    error: null,
  },

  reducers: {
    /* 🔹 Restore auth on page reload */
    initializeAuth: (state) => {
      const token = getAuthToken();
      state.token = token;
      state.isAuthenticated = !!token;
    },

    /* 🔹 Logout */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeAuthToken();
    },

    /* 🔹 Clear auth error */
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- LOGIN ---------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.access;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- SIGNUP ---------- */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- VERIFY OTP ---------- */
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.access;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- GOOGLE LOGIN ---------- */
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.access;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
