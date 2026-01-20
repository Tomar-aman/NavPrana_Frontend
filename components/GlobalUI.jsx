"use client";

import { useSelector } from "react-redux";
import NavPranaLoader from "./NavPranaLoader";

const GlobalUI = () => {
  const globalLoading = useSelector((state) => state.ui?.globalLoading);

  if (!globalLoading) return null;

  return <NavPranaLoader />;
};

export default GlobalUI;
