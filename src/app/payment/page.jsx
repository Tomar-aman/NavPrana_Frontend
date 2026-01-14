import React from "react";
import PaymentPending from "../../../components/PaymentPending";
// import PaymentSuccess from "../../../components/PaymentSuccess";
// import PaymentFailed from "../../../components/PaymentFailed";

const Page = () => {
  return (
    <div>
      {/* <PaymentSuccess /> */}
      {/* <PaymentFailed /> */}
      <PaymentPending />
    </div>
  );
};

export default Page;
