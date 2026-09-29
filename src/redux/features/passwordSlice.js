import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { forgotPasswordOTP } from "@/services/auth/forgot-password-otp";
import { forgotPasswordOTPVerify } from "@/services/auth/forgot-password-otp-verify";
import { forgotPassword } from "@/services/auth/forgot-password";
import { changePassword as changePasswordAPI } from "@/services/auth/change-password";

// The message the backend put on an error: `message` from the WhatsApp path,
// field lists ({"otp": ["…"]}) from the email path.
const apiError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data || typeof data !== "object") return fallback;
  if (data.message) return data.message;
  const first = Object.values(data)[0];
  return (Array.isArray(first) ? first[0] : first) || fallback;
};

/* ================= SEND OTP ================= */
// `contact` is { email } or { phone_number } — a phone gets the code on WhatsApp.
export const sendForgotOtp = createAsyncThunk(
  "password/sendOtp",
  async (contact, { rejectWithValue }) => {
    try {
      return await forgotPasswordOTP(contact);
    } catch (err) {
      return rejectWithValue(apiError(err, "Failed to send OTP"));
    }
  }
);

/* ================= VERIFY OTP ================= */
// Resolves with { uid, token }; the reset below is refused without them.
export const verifyForgotOtp = createAsyncThunk(
  "password/verifyOtp",
  async ({ contact, otp }, { rejectWithValue }) => {
    try {
      return await forgotPasswordOTPVerify({ ...contact, otp });
    } catch (err) {
      return rejectWithValue(apiError(err, "Invalid OTP"));
    }
  }
);

/* ================= RESET PASSWORD (FORGOT) ================= */
export const resetPassword = createAsyncThunk(
  "password/reset",
  async ({ uid, token, password, confirm_password }, { rejectWithValue }) => {
    try {
      return await forgotPassword({ uid, token, password, confirm_password });
    } catch (err) {
      return rejectWithValue(apiError(err, "Password reset failed"));
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
    step: 1,
    contact: null, // { email } or { phone_number }, kept across the steps
    reset: null,   // { uid, token } from a verified OTP
    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    resetPasswordState: (state) => {
      state.step = 1;
      state.contact = null;
      state.reset = null;
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
        state.contact = action.meta.arg;
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
      .addCase(verifyForgotOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 3;
        state.reset = { uid: action.payload.uid, token: action.payload.token };
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
