import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAddress } from "@/services/profile/get-address";
import { deleteAddresses } from "@/services/profile/delete-address";
import { updateAddress } from "@/services/profile/update-address";

/* ================= GET ADDRESS ================= */
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAddress(); // ✅ already data
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue("Failed to load addresses");
    }
  }
);

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddresses(id);
      return id; // ✅ return id for reducer
    } catch (err) {
      return rejectWithValue("Delete failed");
    }
  }
);

/* ================= EDIT ADDRESS ================= */
export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateAddress(id, data); // ✅ fixed
      return updated; // updated address object
    } catch (err) {
      return rejectWithValue("Edit failed");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [], // ✅ ALWAYS ARRAY
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---------- GET ---------- */
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload;
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter((addr) => addr.id !== action.payload);
      })

      /* ---------- EDIT ---------- */
      .addCase(editAddress.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (addr) => addr.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload; // ✅ instant UI update
        }
      });
  },
});

export default addressSlice.reducer;
