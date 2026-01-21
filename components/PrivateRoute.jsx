"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authToken";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/auth");
    } else {
      setAuthorized(true);
    }

    setChecking(false);
  }, [router]);

  if (checking) return null; // or loader

  return authorized ? children : null;
};

export default PrivateRoute;
