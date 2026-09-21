


"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {  useLocale } from "next-intl";

export default function About() {
  const t = useTranslations("home.about");
  const currentLocale = useLocale();

  return (
    <section className="w-full bg-white px-6 py-10">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#2F5F48]">
          {t("title")}
        </h1>
        <div className="w-16 h-1.5 rounded-md bg-[#E7EDFF] mx-auto"></div>
      </div>

      {/* Background image + overlay */}
      <div className="relative mt-8 w-full h-[500px] rounded-2xl overflow-hidden">
        <Image
          src="/assets/new.jpeg"
          alt="About Us"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-6">
          <div className="absolute max-w-4xl mx-auto inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-8 md:px-12 xl:px-[3.5vw]">
            <h2 className="text-[20px] sm:text-[26px] md:text-3xl font-semibold mt-4 sm:mt-8 xl:mt-[3vw] mb-2 sm:mb-4 xl:mb-[1vw]">
              {t("heading")}
            </h2>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] font-medium">
              {t("description")}
            </p>
            <Link
              href={(`/${currentLocale}/about`)}
              className="bg-[#aec597] text-black mt-6 sm:mt-8 xl:mt-[3vw] hover:bg-gray-300 text-[#1D2C57] font-medium px-6 sm:px-10 md:px-12 py-3 sm:py-4 xl:px-[3vw] xl:py-[1.5vw] rounded-full transition-all duration-300 text-[14px] sm:text-[16px] xl:text-[1.2vw]"
            >
              {t("buttonText")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}