"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi } from "@/services/auth/login";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/utils/authToken";

const initialState = {
    token: null,
    user: null,
    status: "idle",
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginApi(credentials);
            if (data?.access) {
                setAuthToken(data.access);
            }

            return {
                token: data?.access || null,
                user: data?.user || data?.profile || null,
                raw: data,
            };
        } catch (error) {
            return rejectWithValue({
                message: error?.message || "Login failed",
                status: error?.status,
            });
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    removeAuthToken();
    // Force redirect to home after logout
    if (typeof window !== "undefined") {
        window.location.href = "/";
    }
    return true;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        hydrateFromCookie: (state, action) => {
            state.token = action.payload || null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload?.token || null;
                state.user = action.payload?.user || null;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Unable to login";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.status = "idle";
                state.error = null;
            });
    },
});

export const { hydrateFromCookie } = authSlice.actions;
export default authSlice.reducer;
