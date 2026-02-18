"use client";

import { useSelector } from "react-redux";
import NavPranaLoader from "./NavPranaLoader";
import SignupOfferPopup from "./SignupOfferPopup";

const GlobalUI = () => {
  const globalLoading = useSelector((state) => state.ui?.globalLoading);

  return (
    <>
      {globalLoading && <NavPranaLoader />}
      <SignupOfferPopup />
    </>
  );
};

export default GlobalUI;
