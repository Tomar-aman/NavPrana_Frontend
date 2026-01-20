import { inVoiceApi } from "@/services/Invoice/invoice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------------- GET INVOICE ---------------- */
export const getInvoice = createAsyncThunk(
  "invoice/getInvoice",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await inVoiceApi(orderId);
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch invoice",
      );
    }
  },
);

/* ---------------- SLICE ---------------- */
const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    loading: false,
    invoiceData: null,
    error: null,
  },
  reducers: {
    resetInvoice: (state) => {
      state.loading = false;
      state.invoiceData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- GET INVOICE -------- */
      .addCase(getInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceData = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
