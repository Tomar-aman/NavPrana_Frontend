import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { forgotPasswordOTP } from "@/services/auth/forgot-password-otp";
import { forgotPasswordOTPVerify } from "@/services/auth/forgot-password-otp-verify";
import { forgotPassword } from "@/services/auth/forgot-password";
import { changePassword as changePasswordAPI } from "@/services/auth/change-password";

/* ================= SEND OTP ================= */

export const sendForgotOtp = createAsyncThunk(
  "password/sendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      return await forgotPasswordOTP({ email });
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyForgotOtp = createAsyncThunk(
  "password/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      return await forgotPasswordOTPVerify({ email, otp });
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Invalid OTP");
    }
  }
);

/* ================= RESET PASSWORD (FORGOT) ================= */
export const resetPassword = createAsyncThunk(
  "password/reset",
  async ({ email, password, confirm_password }, { rejectWithValue }) => {
    try {
      return await forgotPassword({ email, password, confirm_password });
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Password reset failed"
      );
    }
  }
);

/* ================= CHANGE PASSWORD (LOGGED IN) ================= */
export const changePassword = createAsyncThunk(
  "password/change",
  async (
    { old_password, new_password, confirm_password },
    { rejectWithValue }
  ) => {
    try {
      return await changePasswordAPI({
        old_password,
        new_password,
        confirm_password,
      });
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Change password failed"
      );
    }
  }
);

const passwordSlice = createSlice({
  name: "password",
  initialState: {
    step: 1, // forgot flow steps
    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    resetPasswordState: (state) => {
      state.step = 1;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- SEND OTP ---------- */
      .addCase(sendForgotOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2;
        state.successMessage = action.payload?.message;
      })
      .addCase(sendForgotOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- VERIFY OTP ---------- */
      .addCase(verifyForgotOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyForgotOtp.fulfilled, (state) => {
        state.loading = false;
        state.step = 3;
      })
      .addCase(verifyForgotOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- RESET PASSWORD ---------- */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- CHANGE PASSWORD ---------- */
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
