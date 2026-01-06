"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/services/profile/get-profile";
import { getAuthToken, removeAuthToken } from "@/utils/authToken";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load profile (used on refresh + manual call)
  const loadProfile = async () => {
    const token = getAuthToken();

    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
      removeAuthToken();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Load on app mount (refresh)
  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile, // 🔥 set after login
        loadProfile, // 🔥 manual refresh

        loading,
        isLoggedIn: !!profile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// 🔥 Custom hook
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
};
