"use client";

import Image from "next/image";
import "./NavPranaLoader.css";
import Logo from "../src/assets/Ghee package design-c.svg";

export default function NavPranaLoader() {
  return (
    <div className="loader-wrapper">
      <div className="foliage-container">
        <div className="center-text">
          <Image src={Logo} alt="NavPrana Organics" />
        </div>

        <div className="leaf leaf-1">🍃</div>
        <div className="leaf leaf-2">🌿</div>
        <div className="leaf leaf-3">🍃</div>
        <div className="leaf leaf-4">🌿</div>
        <div className="leaf leaf-5">🍃</div>
        <div className="leaf leaf-6">🌿</div>
      </div>
    </div>
  );
}
