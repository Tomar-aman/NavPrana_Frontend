import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToCartAPI } from "@/services/cart/addToCart";
import { getCartAPI } from "@/services/cart/getCart";
import { deleteCartAPI } from "@/services/cart/delectCart";
import { updateCartAPI } from "@/services/cart/updateCart";

/* ================= ADD TO CART ================= */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity }, { rejectWithValue }) => {
    try {
      console.log(product, quantity);
      const res = await addToCartAPI({ product, quantity });
      return res.data; // ✅ FIXED
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

/* ================= GET CART ================= */
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartAPI();
      console.log(res);
      return res; // ✅ ONLY DATA
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

/* ================= UPDATE CART ================= */
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartAPI(cartId, { quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

/* ================= DELETE CART ================= */
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (cartId, { rejectWithValue }) => {
    try {
      await deleteCartAPI(cartId);
      return cartId; // ✅ return id to remove from store
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete cart item"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // 🛒 cart items
    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    resetCartState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- ADD ---------- */
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || "Added to cart";

        if (action.payload?.cart_items) {
          state.items = action.payload.cart_items;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- GET ---------- */
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
