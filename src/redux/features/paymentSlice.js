import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paymentStatusAPI } from "@/services/payment/paymentStatus";

/**
 * 🔄 Check Payment Status
 */
export const paymentStatus = createAsyncThunk(
  "payment/paymentStatus",
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await paymentStatusAPI(transactionId);
      return res;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error.message || "Payment status failed",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    success: false,
    paymentData: null,
    error: null,
  },

  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.paymentData = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- PAYMENT STATUS ---------- */
      .addCase(paymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(paymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.paymentData = action.payload;
      })

      .addCase(paymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
