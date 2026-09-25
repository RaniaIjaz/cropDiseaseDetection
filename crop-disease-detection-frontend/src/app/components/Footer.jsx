"use client";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const SOCIALS = [
  { href: "https://www.instagram.com/", label: "Instagram", Icon: Instagram },
  { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: Linkedin },
  { href: "mailto:hello@agridoctor.com", label: "Email", Icon: Mail },
];

const Footer = () => {
  const t = useTranslations("footer");
  const tNav = useTranslations("navbar");
  const currentLocale = useLocale();
  const navItems = tNav.raw("navItems") || [];

  return (
    <footer className="mt-auto bg-brand-800 text-white">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12 lg:py-14">
        {/* Brand */}
        <div>
          <Link
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-3"
          >
            <span className="relative block h-11 w-11 overflow-hidden rounded-full bg-white/95">
              <Image
                src="/assets/logo3.png"
                alt=""
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </span>
            <span className="text-lg font-bold tracking-tight">AgriDoctor</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70 text-pretty">
            {t("tagline")}
          </p>
        </div>

        {/* Links */}
        <nav aria-label={t("explore")}>
          <h2 className="text-xs font-semibold tracking-wider text-sage-300 uppercase">
            {t("explore")}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${currentLocale}${item.href === "/" ? "" : item.href}`}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials */}
        <div>
          <h2 className="text-xs font-semibold tracking-wider text-sage-300 uppercase">
            {t("connect")}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-500"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-white/65 sm:flex-row sm:text-start sm:text-sm">
          <span>
            &copy; {new Date().getFullYear()} AgriDoctor.com — {t("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
