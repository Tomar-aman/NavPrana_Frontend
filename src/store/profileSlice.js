"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "@/services/profile/get-profile";
import { logoutUser } from "./authSlice";

const initialState = {
    data: null,
    status: "idle",
    error: null,
};

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfile();
            return data;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || "Unable to fetch profile",
                status: error?.status,
            });
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Unable to fetch profile";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.data = null;
                state.status = "idle";
                state.error = null;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
