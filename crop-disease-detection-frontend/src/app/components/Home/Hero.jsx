// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useTranslations } from "next-intl";

// const slides = [
//   {
//     image: "/assets/mainn.png",
//     title: "AI-Powered Wheat & Cotton Disease Detection",
//     description:
//       "Upload crop images, detect diseases instantly, and get recommended solutions.",
//     buttonText: "Try Detection",
//     buttonLink: "/disease-detection",
//   },
//   {
//     image: "/assets/new.jpeg",
//     title: "Boost Crop Health with AI Insights",
//     description:
//       "Empowering farmers with AI-driven insights for sustainable farming.",
//     buttonText: "Learn More",
//     buttonLink: "/about",
//   },
//   {
//     image: "/assets/main3.jpg",
//     title: "Precision Agriculture Made Easy",
//     description:
//       "Identify diseases early and take the right actions for maximum yield.",
//     buttonText: "Get Started",
//     buttonLink: "/disease-detection",
//   },
//   {
//     image: "/assets/main3.jpg",
//     title: "Smart Farming for a Smarter Future",
//     description:
//       "Revolutionizing agriculture through artificial intelligence and innovation.",
//     buttonText: "Explore More",
//     buttonLink: "/contact",
//   },
// ];

// const Hero = () => {
//   const t = useTranslations("home");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === slides.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? slides.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <section className="relative h-[80vh] overflow-hidden">
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
//           }`}
//           style={{
//             backgroundImage: `url(${slide.image})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="absolute inset-0 bg-black/60"></div>

//           <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
//             <h1 className="text-3xl hero-title md:text-5xl font-bold max-w-3xl">
//               {slide.title}
//               {/* {t("heroTitle")} */}
//             </h1>
//             <p className="mt-4 text-lg md:text-xl max-w-2xl">
//               {slide.description}
//             </p>
//             <Link
//               href={slide.buttonLink}
//               className="mt-6 bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-md shadow hover:bg-yellow-300 transition"
//             >
//               {slide.buttonText}
//             </Link>
//           </div>
//         </div>
//       ))}

//       {/* Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full z-30"
//       >
//         <ChevronLeft size={28} />
//       </button>

//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full z-30"
//       >
//         <ChevronRight size={28} />
//       </button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === currentIndex
//                 ? "bg-yellow-400 scale-110"
//                 : "bg-white/50 hover:bg-white/70"
//             }`}
//           ></button>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Hero;






"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations,useLocale } from "next-intl";


const Hero = () => {
  const t = useTranslations("home");
  const [currentIndex, setCurrentIndex] = useState(0);
   const currentLocale = useLocale();
  
  // Get slides from translations using .raw() method
  const slides = t.raw("heroSlides") || [];
  
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Show loading or fallback if no slides
  if (slides.length === 0) {
    return (
      <section className="relative h-[80vh] overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Loading slides...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
            <h1 className="text-3xl hero-title md:text-5xl font-bold max-w-3xl">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              {slide.description}
            </p>
            <Link
              // href={slide.buttonLink}
              href={(`/${currentLocale}${slide.buttonLink}`)}
              className="mt-6 bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-md shadow hover:bg-yellow-300 transition"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* Arrows - only show if there are slides */}
      {slides.length > 0 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full z-30"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full z-30"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-yellow-400 scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;