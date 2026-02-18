"use client";

import Image from "next/image";
import Slider from "react-slick";
import pineappleImage from "@/assets/hero_image.png";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };

  return (
    <section
      id="home"
      className="
        relative w-full overflow-hidden
        pt-20
        h-[45vh]
        sm:h-[60vh]
        md:h-[85vh]
        lg:h-screen
      "
    >
      <div className="relative w-full h-full">
        <Image
          src={pineappleImage}
          alt="Hero Background"
          fill
          className="object-contain sm:object-cover object-center"
        />
      </div>
    </section>
  );
};

export default Hero;
