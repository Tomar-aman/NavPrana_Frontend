import { createOrderAPI } from "@/services/order/createOrder";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Create Order Thunk
 */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload);
      const res = await createOrderAPI(payload); // ✅ await
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Order creation failed"
      );
    }
  }
);

const createOrderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
    orderData: null,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.success = false;
      state.orderData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = createOrderSlice.actions;
export default createOrderSlice.reducer;
