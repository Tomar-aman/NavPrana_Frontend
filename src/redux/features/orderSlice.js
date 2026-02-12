import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrderAPI } from "@/services/order/createOrder";
import { getOrderAPI } from "@/services/order/getOrder";
import { orderDetailAPI } from "@/services/order/orderDetails";

/* ================= CREATE ORDER ================= */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      return await createOrderAPI(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Order creation failed",
      );
    }
  },
);

/* ================= GET ORDER LIST ================= */
export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (page, { rejectWithValue }) => {
    try {
      const response = await getOrderAPI(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch orders",
      );
    }
  },
);

/* ================= ORDER DETAILS ================= */
export const orderDetail = createAsyncThunk(
  "order/orderDetail",
  async (id, { rejectWithValue }) => {
    try {
      return await orderDetailAPI(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch order detail",
      );
    }
  },
);

/* ================= SLICE ================= */
const orderSlice = createSlice({
  name: "order",
  initialState: {
    createLoading: false,
    fetchLoading: false,
    detailLoading: false,

    success: false,

    orderData: null, // latest created order
    orderList: [], // all orders
    orderDetail: null, // single order detail

    error: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.createLoading = false;
      state.fetchLoading = false;
      state.detailLoading = false;
      state.success = false;
      state.orderData = null;
      state.orderDetail = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- CREATE ORDER ---------- */
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.success = false;
        state.error = action.payload;
      })

      /* ---------- GET ORDER LIST ---------- */
      .addCase(getOrder.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      })

      /* ---------- ORDER DETAIL ---------- */
      .addCase(orderDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(orderDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetail = action.payload;
      })
      .addCase(orderDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
