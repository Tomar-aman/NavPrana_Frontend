import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProduct } from "../../services/products/get-product";
import { withSafeReviews, withFamilyRatings } from "@/lib/reviews";

/* ================= GET PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProduct(); // ✅ await API
      const list = res?.results || res?.data || [];
      if (!Array.isArray(list)) return [];
      // Normalise exactly the way the server catalogue does (see lib/site.js).
      // This list replaces the server-rendered one on hydration, so without the
      // same transform a size variant lost its pooled rating the moment the
      // page became interactive — the card showed 4.8 in the HTML, then nothing.
      return withFamilyRatings(list.map(withSafeReviews));
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
