import {
  addReviewAPI,
  getReviewAPI,
  updateReviewAPI,
} from "@/services/review/review";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getReview = createAsyncThunk(
  "review/getReview",
  async (_, { rejectWithValue }) => {
    try {
      // API call to fetch reviews
      const reviews = await getReviewAPI();
      return reviews;
    } catch (err) {
      return rejectWithValue("Failed to load reviews");
    }
  },
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async (data, { rejectWithValue }) => {
    try {
      // API call to add a review
      const newReview = await addReviewAPI(data);
      return newReview;
    } catch (err) {
      return rejectWithValue("Failed to add review");
    }
  },
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // API call to update a review
      const updatedReview = await updateReviewAPI(id, data);
      return updatedReview;
    } catch (err) {
      return rejectWithValue("Failed to update review");
    }
  },
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= GET REVIEWS ================= */
      .addCase(getReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= ADD REVIEW ================= */
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload); // add at top
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE REVIEW ================= */
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.id,
        );

        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
