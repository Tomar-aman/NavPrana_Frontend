"use client";

import { useSelector } from "react-redux";
import NavPranaLoader from "./NavPranaLoader";
import SignupOfferPopup from "./SignupOfferPopup";
import WhatsAppButton from "./WhatsAppButton";

const GlobalUI = () => {
  const globalLoading = useSelector((state) => state.ui?.globalLoading);

  return (
    <>
      {globalLoading && <NavPranaLoader />}
      <SignupOfferPopup />
      <WhatsAppButton />
    </>
  );
};

export default GlobalUI;
