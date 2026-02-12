import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileAPI } from "@/services/profile/get-profile";
import { editProfile } from "@/services/profile/edit-profile";

/* ================= GET PROFILE ================= */
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfileAPI();
      return data; // user object
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

/* ================= EDIT PROFILE ================= */
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await editProfile(formData);
      return res; // updated profile
    } catch (err) {
      return rejectWithValue("Profile update failed");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null, // 👤 user profile
    loading: false,
    error: null,
  },

  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- GET PROFILE ---------- */
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
      }) /* ---------- UPDATE ---------- */
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // 🔥 auto update UI
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
