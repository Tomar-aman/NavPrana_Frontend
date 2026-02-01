"use client";

import { ArrowRight, Leaf, TreePine, Flower } from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";

// import natureHeroImage from "@/assets/nature-hero.jpg";
// import mangoImage from "@/assets/mango-juice-glass-wooden-table.jpg";
// import pineappleImage from "@/assets/tasty-pineapple-still-life.jpg";
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
  };

  return (
    <section
      id="home"
      className="relative bg-white min-h-screen flex items-center overflow-hidden mt-20"
    >
      {/* Slider Background */}
      <div className="absolute inset-0">
        <Slider {...settings} className="h-full">
          {[pineappleImage].map((img, i) => (
            <div key={i} className="relative h-screen">
              <Image
                src={img}
                alt="Hero Background"
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </Slider>

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/70"></div>
      </div>

      {/* Hero Content */}
      {/* <div className="relative container mx-auto px-4 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Pure <span className="text-gradient">Nature's Gift</span>
            <br />
            <span className="text-3xl md:text-5xl text-muted-foreground">
              Traditional Desi Ghee
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/80 mt-6">
            From green pastures to your kitchen – experience pure desi ghee.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button className="bg-white/50 text-black px-6 py-3 rounded-md flex items-center gap-2 hover:bg-primary/90 transition">
              Shop Nature's Finest
              <ArrowRight className="h-5 w-5" />
            </button>

            <button className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/5 transition">
              Learn Our Story
            </button>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
