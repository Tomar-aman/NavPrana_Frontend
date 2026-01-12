"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getProfileAPI } from "@/services/profile/get-profile";
import { getAuthToken, removeAuthToken } from "@/utils/authToken";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👤 Load profile
  const loadProfile = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getProfileAPI();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
      removeAuthToken();
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔁 Load on app refresh
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,

        loading,
        isLoggedIn: !!profile,

        // exposed helpers
        setProfile,
        loadProfile,
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
