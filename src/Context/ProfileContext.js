"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "@/services/profile/get-profile";
import { getAuthToken } from "@/utils/authToken";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load profile on refresh
  useEffect(() => {
    const loadProfile = async () => {
      const token = getAuthToken();

      // ❌ If no token, no profile
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        isLoggedIn: !!profile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// 🔥 Custom hook
export const useProfile = () => useContext(ProfileContext);
