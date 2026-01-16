"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuthToken } from "@/utils/authToken";
import { initializeAuth } from "@/redux/features/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      dispatch(initializeAuth(token));
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
