"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

export default store;
