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
      // Come back here after signing in, e.g. from a link in an order email.
      const here = window.location.pathname + window.location.search;
      router.replace(`/signin?next=${encodeURIComponent(here)}`);
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

