import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "@/services/auth/login";
import { signUp } from "@/services/auth/signUp";
import { verifyAPI } from "@/services/auth/verifyOTP";
import { setAuthToken, removeAuthToken } from "@/utils/authToken";

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);
      console.log(res);

      setAuthToken(res.access);

      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Login failed");
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
      return rejectWithValue(err?.response?.data || "Signup failed");
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await verifyAPI(payload);
    } catch (err) {
      return rejectWithValue("Invalid OTP");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // 👈 USER DATA
    token: null, // 👈 ACCESS TOKEN
    loading: false,
    error: null,
    isAuthenticated: false,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeAuthToken();
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
        state.user = action.payload;
        state.isAuthenticated = true;
        state.token = action.payload.access; // ✅ SAVE TOKEN
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- SIGNUP ---------- */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
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
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
