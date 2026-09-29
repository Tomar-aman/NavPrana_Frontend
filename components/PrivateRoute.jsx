"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authToken";
import NavPranaLoader from "./NavPranaLoader";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/signin");
    } else {
      setAuthorized(true);
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return <NavPranaLoader />;
  }

  return authorized ? children : null;
};

export default PrivateRoute;

