import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { couponApplyAPI } from "@/services/coupon/couponApply";

/**
 * Apply Coupon Thunk
 */
export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await couponApplyAPI(payload);
      return res; // API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Coupon apply failed"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    loading: false,
    success: false,
    couponData: null,
    error: null,
  },
  reducers: {
    resetCouponState: (state) => {
      state.loading = false;
      state.success = false;
      state.couponData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.couponData = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;
