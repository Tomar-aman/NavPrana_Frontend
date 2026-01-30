// "use client";

// import { ArrowRight, Leaf, TreePine, Flower } from "lucide-react";
// import Image from "next/image";
// import natureHeroImage from "@/assets/nature-hero.jpg";
// import moduleName from "@/assets/mango-juice-glass-wooden-table.jpg";
// import moduleName from "@/assets/tasty-pineapple-still-life.jpg";

// const Hero = () => {
//   return (
//     <section
//       id="home"
//       className="relative bg-white min-h-screen flex items-center overflow-hidden mt-20"
//     >
//       {/* Background Image with Overlay */}
//       <div className="absolute inset-0">
//         <Image
//           src={natureHeroImage}
//           alt="Pure Desi Ghee in natural countryside setting with organic elements"
//           className="w-full h-full object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-background/70"></div>
//       </div>

//       <div className="relative container mx-auto px-4 py-20">
//         <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
//           {/* Hero Content */}
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <h1 className="text-5xl md:text-7xl font-bold leading-tight">
//                 Pure <span className="text-gradient">Nature's Gift</span>
//                 <br />
//                 <span className="text-3xl md:text-5xl text-muted-foreground">
//                   Traditional Desi Ghee
//                 </span>
//               </h1>

//               <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
//                 From green pastures to your kitchen - experience the pure
//                 essence of nature in every drop of our traditionally crafted
//                 desi ghee. Made with love, respect for nature, and time-honored
//                 methods.
//               </p>
//             </div>

//             {/* Trust Indicators */}
//             <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
//               <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
//                 <TreePine className="h-4 w-4 text-primary" />
//                 <span>Farm Fresh & Natural</span>
//               </div>
//               <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
//                 <Leaf className="h-4 w-4 text-primary" />
//                 <span>Sustainable Farming</span>
//               </div>
//               <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
//                 <Flower className="h-4 w-4 text-primary" />
//                 <span>Pure & Organic</span>
//               </div>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
//               <button className="bg-white/50 text-black px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition">
//                 Shop Nature's Finest
//                 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
//               </button>

//               <button className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/5 transition">
//                 Learn Our Story
//               </button>
//             </div>

//             {/* Social Proof */}
//             <div className="pt-12 text-center">
//               <p className="text-muted-foreground text-sm mb-4">
//                 Trusted by thousands of families across India
//               </p>
//               <div className="flex justify-center items-center space-x-2">
//                 <div className="flex space-x-1">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className="w-5 h-5 text-primary fill-current"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <span className="text-sm font-medium">
//                   4.9/5 from 2,500+ reviews
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative Nature Elements */}
//       <div className="absolute top-20 left-10 animate-sway">
//         <div className="w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
//       </div>
//       <div
//         className="absolute bottom-20 right-10 animate-float"
//         style={{ animationDelay: "2s" }}
//       >
//         <div className="w-16 h-16 bg-accent/10 rounded-full blur-xl"></div>
//       </div>
//       <div
//         className="absolute top-1/2 right-20 animate-sway"
//         style={{ animationDelay: "1s" }}
//       >
//         <div className="w-12 h-12 bg-secondary/10 rounded-full blur-lg"></div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

"use client";

import { ArrowRight, Leaf, TreePine, Flower } from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";

import natureHeroImage from "@/assets/nature-hero.jpg";
import mangoImage from "@/assets/mango-juice-glass-wooden-table.jpg";
import pineappleImage from "@/assets/tasty-pineapple-still-life.jpg";

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
          {[natureHeroImage, mangoImage, pineappleImage].map((img, i) => (
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
      <div className="relative container mx-auto px-4 py-20 z-10">
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

          {/* Buttons */}
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
      </div>
    </section>
  );
};

export default Hero;
