"use client";

import { useEffect } from "react";
import { getAuthToken } from "@/utils/authToken";
import { hydrateFromCookie, logoutUser } from "./authSlice";
import { clearProfile, fetchProfile } from "./profileSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

const AppBootstrap = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        const tokenFromCookie = getAuthToken();
        if (tokenFromCookie) {
            dispatch(hydrateFromCookie(tokenFromCookie));
        }
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            dispatch(fetchProfile())
                .unwrap()
                .catch((error) => {
                    if (error?.status === 401) {
                        dispatch(logoutUser());
                    }
                });
        } else {
            dispatch(clearProfile());
        }
    }, [dispatch, token]);

    return null;
};

export default AppBootstrap;
