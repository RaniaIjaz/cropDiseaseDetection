"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function About() {
  const t = useTranslations("home.about");
  const currentLocale = useLocale();

  return (
    <section className="section-y bg-white pt-0">
      <div className="shell">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-800 sm:text-4xl">
            {t("title")}
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-3 block h-1.5 w-16 rounded-full bg-sage-400"
          />
        </div>

        {/* Height grows with the copy instead of being pinned to 500px, which
            clipped the paragraph and button at narrow widths. */}
        <div className="relative mt-10 min-h-[26rem] overflow-hidden rounded-3xl sm:min-h-[28rem] lg:min-h-[31rem]">
          <Image
            src="/assets/new.jpeg"
            alt=""
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/70" />

          <div className="relative flex min-h-[26rem] flex-col items-center justify-center px-6 py-14 text-center text-white sm:min-h-[28rem] sm:px-10 lg:min-h-[31rem] lg:px-16">
            <h3 className="max-w-3xl text-xl font-semibold text-balance sm:text-2xl md:text-3xl">
              {t("heading")}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 text-pretty sm:text-base md:text-lg">
              {t("description")}
            </p>
            <Link
              href={`/${currentLocale}/about`}
              className="mt-8 rounded-full bg-sage-400 px-8 py-3.5 text-sm font-semibold text-brand-900 shadow-lg transition-all hover:bg-sage-300 active:scale-95 sm:px-10 sm:text-base"
            >
              {t("buttonText")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
