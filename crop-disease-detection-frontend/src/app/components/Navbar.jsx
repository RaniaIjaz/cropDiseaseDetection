"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import SignUp from "./Signup";
import Login from "./Login/Login";
import { logout } from "../redux/slices/userSlice";

const LOCALES = [
  { code: "en", labelKey: "language.english" },
  { code: "ur", labelKey: "language.urdu" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.user);
  const menuButtonRef = useRef(null);

  const t = useTranslations("navbar");
  const navItems = t.raw("navItems") || [];
  const currentLocale = useLocale();

  // Path with the `/en` | `/ur` prefix removed, used for both active-state
  // matching and for language switching.
  const pathWithoutLocale = pathname.replace(/^\/(en|ur)(?=\/|$)/, "") || "/";

  const isActive = (href) =>
    href === "/" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(href);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push(`/${currentLocale}/`);
  };

  const goToHistory = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push(`/${currentLocale}/history`);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  const handleLanguageChange = (locale) => {
    setShowLanguageDropdown(false);
    setIsMobileMenuOpen(false);
    router.push(`/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
  };

  // A single outside-click/Escape handler for all three popovers.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest(".js-popover")) {
        setShowLanguageDropdown(false);
        setShowDropdown(false);
      }
      if (isMobileMenuOpen && !event.target.closest(".js-mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setShowLanguageDropdown(false);
      setShowDropdown(false);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Navigating away (including via the browser back button) should never leave
  // the drawer hanging open over the new page.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
    setShowLanguageDropdown(false);
  }, [pathname]);

  const activeLocale = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="shell flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link
            href={`/${currentLocale}`}
            className="flex shrink-0 items-center"
            aria-label="AgriDoctor home"
          >
            <span className="relative block h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src="/assets/logo3.png"
                alt="AgriDoctor"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${currentLocale}${item.href === "/" ? "" : item.href}`}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors lg:text-base ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-600"
                    : "text-ink hover:bg-gray-50 hover:text-brand-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop right-hand controls */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Language switcher */}
            <div className="js-popover relative">
              <button
                type="button"
                onClick={() => {
                  setShowLanguageDropdown((v) => !v);
                  setShowDropdown(false);
                }}
                aria-haspopup="menu"
                aria-expanded={showLanguageDropdown}
                aria-label={t("language.label")}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Globe className="h-4 w-4 text-gray-500" aria-hidden="true" />
                <span className="hidden lg:inline">{t(activeLocale.labelKey)}</span>
                <span className="lg:hidden">{activeLocale.code.toUpperCase()}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                    showLanguageDropdown ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {showLanguageDropdown && (
                <ul
                  role="menu"
                  className="absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                >
                  {LOCALES.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleLanguageChange(l.code)}
                        className={`flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-start text-sm transition-colors hover:bg-gray-50 ${
                          currentLocale === l.code
                            ? "bg-brand-50 font-semibold text-brand-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{t(l.labelKey)}</span>
                        {currentLocale === l.code && (
                          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isLogin ? (
              <div className="js-popover relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown((v) => !v);
                    setShowLanguageDropdown(false);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={showDropdown}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-200 py-1.5 ps-1.5 pe-3 transition-colors hover:bg-brand-50"
                >
                  <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-brand-100">
                    <Image
                      src="/assets/profileImage.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  <span className="max-w-[9rem] truncate text-sm font-medium text-ink">
                    {user?.userName || "User"}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {showDropdown && (
                  <ul
                    role="menu"
                    className="absolute end-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                  >
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={goToHistory}
                        className="w-full cursor-pointer px-4 py-2.5 text-start text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                      >
                        {t("userDropdown.history")}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full cursor-pointer px-4 py-2.5 text-start text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        {t("userDropdown.logout")}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openModal("signup")}
                className="cursor-pointer rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold whitespace-nowrap text-white shadow-sm transition-all hover:bg-brand-600 active:scale-95 lg:text-base"
              >
                {t("authButton")}
              </button>
            )}
          </div>

          {/* Mobile trigger — `md` so it hands over to the desktop bar at the
              exact width the desktop links appear. The old sm/md split left
              640–767px with no navigation at all. */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="js-mobile-menu -me-2 cursor-pointer rounded-lg p-2.5 text-ink transition-colors hover:bg-gray-100 md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="js-mobile-menu max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gray-200 bg-white shadow-lg md:hidden"
          >
            <div className="shell space-y-1 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href === "/" ? "" : item.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-ink hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-3">
                <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {t("language.label")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleLanguageChange(l.code)}
                      className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        currentLocale === l.code
                          ? "bg-brand-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t(l.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-3">
                {isLogin ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-100">
                        <Image
                          src="/assets/profileImage.png"
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                      <span className="truncate text-sm font-semibold text-gray-800">
                        {user?.userName || "User"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={goToHistory}
                      className="w-full cursor-pointer rounded-lg px-3 py-3 text-start text-base font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      {t("userDropdown.history")}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full cursor-pointer rounded-lg px-3 py-3 text-start text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      {t("mobileMenu.logout")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openModal("signup")}
                    className="w-full cursor-pointer rounded-xl bg-brand-500 px-4 py-3 text-base font-bold text-white transition-colors hover:bg-brand-600"
                  >
                    {t("authButton")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Brand accent rule. The old 20px / 1.5vw border ate up to 29px of
            vertical space on wide screens. */}
        <div aria-hidden="true" className="h-1 w-full bg-brand-500 sm:h-1.5" />
      </header>

      {isModalOpen && modalType === "signup" && (
        <SignUp isOpen onClose={closeModal} toggleModal={openModal} />
      )}
      {isModalOpen && modalType === "login" && (
        <Login isOpen onClose={closeModal} toggleModal={openModal} />
      )}
    </>
  );
};

export default Navbar;
