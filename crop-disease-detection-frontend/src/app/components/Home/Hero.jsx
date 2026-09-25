"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const SLIDE_MS = 6000;

const Hero = () => {
  const t = useTranslations("home");
  const currentLocale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = t.raw("heroSlides") || [];
  const count = slides.length;

  const next = useCallback(
    () => setCurrentIndex((i) => (count ? (i + 1) % count : 0)),
    [count]
  );
  const prev = useCallback(
    () => setCurrentIndex((i) => (count ? (i - 1 + count) % count : 0)),
    [count]
  );

  useEffect(() => {
    if (count < 2 || isPaused) return;
    const id = setInterval(next, SLIDE_MS);
    return () => clearInterval(id);
  }, [count, isPaused, next, currentIndex]);

  if (count === 0) {
    return (
      <section className="flex min-h-[26rem] items-center justify-center bg-brand-50">
        <p className="text-gray-600">Loading…</p>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[32rem] overflow-hidden sm:min-h-[34rem] lg:min-h-[38rem] lg:h-[calc(100svh-5.25rem)] lg:max-h-[46rem]"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={index}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* A vertical scrim keeps the headline readable over every photo
                without flattening the whole image to grey. */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />

            <div className="relative z-20 flex h-full min-h-[32rem] flex-col items-center justify-center px-6 py-20 text-center text-white sm:min-h-[34rem] sm:px-20 lg:min-h-0 lg:px-28">
              <h1 className="max-w-3xl text-3xl leading-tight font-bold text-balance sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/90 text-pretty sm:text-lg lg:text-xl">
                {slide.description}
              </p>
              {slide.buttonText && (
                <Link
                  href={`/${currentLocale}${slide.buttonLink}`}
                  tabIndex={isCurrent ? 0 : -1}
                  className="mt-8 rounded-xl bg-gold-500 px-7 py-3.5 text-base font-semibold text-brand-900 shadow-lg transition-all hover:bg-gold-400 active:scale-95"
                >
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          {/* Hidden below `sm`: at phone widths the arrows sat directly on top
              of the description text. Swipe/dots cover navigation there. */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute start-3 top-1/2 z-30 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:block lg:start-6"
          >
            <ChevronLeft className="h-6 w-6 flip-rtl" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute end-3 top-1/2 z-30 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:block lg:end-6"
          >
            <ChevronRight className="h-6 w-6 flip-rtl" aria-hidden="true" />
          </button>

          <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
                className={`h-2.5 cursor-pointer rounded-full transition-all ${
                  index === currentIndex
                    ? "w-7 bg-gold-500"
                    : "w-2.5 bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
