"use client";

import Image from "next/image";
import Slider from "react-slick";
import pineappleImage from "@/assets/Whisk_82053c231497766ba5e4a0d05e7fa01ddr.png";

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
      className="relative w-full min-h-[40vh] md:min-h-[80vh] lg:min-h-screen overflow-hidden mt-25 md:mt-20"
    >
      {/* Slider */}
      <Slider {...settings} className="h-full">
        {[pineappleImage].map((img, i) => (
          <div
            key={i}
            className="relative w-full  min-h-[40vh] md:min-h-[80vh] lg:min-h-screen"
          >
            <Image
              src={img}
              alt="Hero Background"
              fill
              priority={i === 0}
              sizes="100vw"
              className=" md:object-cover object-center "
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/40" /> */}
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
