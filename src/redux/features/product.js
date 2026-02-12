import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProduct } from "../../services/products/get-product";

/* ================= GET PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProduct(); // ✅ await API
      return res.results; // or res.data based on your API
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load products",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [], // 👈 all products
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---------- GET PRODUCTS ---------- */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      });
  },
});

export default productSlice.reducer;
