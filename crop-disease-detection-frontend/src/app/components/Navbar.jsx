"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { FaGlobe } from "react-icons/fa";
import { usePathname } from "next/navigation";
import SignUp from "../components/Signup";
import Login from "./Login/Login";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/Slices/userSlice";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.user);
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Get translations and current locale
  const t = useTranslations("navbar");
  const navItems = t.raw("navItems") || [];
  const currentLocale = useLocale();

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push(`/${currentLocale}/`);
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

  // Handle language change
  const handleLanguageChange = (locale) => {
    setShowLanguageDropdown(false);
    // Get current path without locale
    const pathWithoutLocale = pathname.replace(/^\/(en|ur)/, "") || "/";
    
    // Navigate to the new locale
    if (locale === "en") {
      router.push(`/en${pathWithoutLocale}`);
    } else {
      router.push(`/ur${pathWithoutLocale}`);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
        setShowLanguageDropdown(false);
      }
      if (showLanguageDropdown && !event.target.closest(".language-dropdown-container")) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, showLanguageDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <>
      <nav className="bg-white sticky py-2 top-0 z-40 border-b-4 sm:border-b-[20px] xl:border-b-[1.5vw] border-b-[#3d9970] shadow-sm">
        <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8 2xl:px-[1vw]">
          <div className="flex items-center justify-between h-14 sm:h-16 xl:h-[12vh]">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href={`/${currentLocale}`} className="flex items-center">
                <div className="relative w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] xl:w-[6vw] xl:h-[7vw]">
                  <Image
                    src="/assets/logo3.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-[3vw] items-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href}`}
                  className={`${
                    pathname.includes(item.href) ? "text-[#3d9970]" : "text-[#151515]"
                  } text-sm md:text-[1.3vw] font-semibold hover:text-[#FFB300] transition-colors duration-200 whitespace-nowrap`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Language Switcher - Desktop */}
              <div className="relative language-dropdown-container ml-4">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <FaGlobe className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {currentLocale === "en" ? t("language.english") : t("language.urdu")}
                  </span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl z-50 border border-gray-200 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-200 ${
                          currentLocale === "en" 
                            ? "bg-[#f4fdf9] text-[#3d9970] font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        🇺🇸 {t("language.english")}
                      </button>
                      <button
                        onClick={() => handleLanguageChange("ur")}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-200 ${
                          currentLocale === "ur" 
                            ? "bg-[#f4fdf9] text-[#3d9970] font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        🇵🇰 {t("language.urdu")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-[0.8vw]">
              {isLogin ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex cursor-pointer items-center space-x-2 p-2 xl:p-[0.6vw] border xl:rounded-[1vw] rounded-lg border-[#2BDF88] hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-7 h-7 md:h-[5vh] md:w-[5vh] overflow-hidden rounded-full ">
                      <Image
                        src="/assets/profileImage.png"
                        alt="User Profile"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="hidden lg:block text-[#151515] text-sm md:text-[1.3vw] max-w-[100px] md:max-w-none truncate">
                      {user?.userName || "User"}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 xl:w-[12vw] bg-white rounded-xl xl:rounded-[1.1vw] shadow-xl z-50 border border-gray-200 overflow-hidden">
                      <div className="py-1">
                        <button
                         onClick={() => router.push(`/${currentLocale}/history`)}
                          className="w-full px-4 py-3 xl:py-[1vw] xl:px-[1.5vw] text-left text-gray-700 text-sm xl:text-[1.2vw] hover:bg-[#f4fdf9] hover:text-[#2BDF88] transition-colors duration-200"
                        >
                          {t("userDropdown.history")}
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 xl:py-[1vw] xl:px-[1.5vw] text-left text-gray-700 text-sm xl:text-[1.2vw] hover:bg-[#fff4f4] hover:text-red-500 transition-colors duration-200"
                        >
                          {t("userDropdown.logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openModal("signup")}
                  className="bg-[#3d9970] px-3 py-2 xl:px-[1vw] xl:py-[1vw] text-sm xl:text-[1.3vw] xl:rounded-[1vw] rounded-lg text-white font-bold hover:bg-[#25c778] active:scale-95 transition-all duration-200 whitespace-nowrap"
                >
                  {t("authButton")}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden mobile-menu-container">
              {/* Language Switcher - Mobile (icon only) */}
              <div className="relative language-dropdown-container mr-4">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <FaGlobe className="h-5 w-5" />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl z-50 border border-gray-200 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-200 ${
                          currentLocale === "en" 
                            ? "bg-[#f4fdf9] text-[#3d9970] font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        🇺🇸 {t("language.english")}
                      </button>
                      <button
                        onClick={() => handleLanguageChange("ur")}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-200 ${
                          currentLocale === "ur" 
                            ? "bg-[#f4fdf9] text-[#3d9970] font-semibold" 
                            : "text-gray-700"
                        }`}
                      >
                        🇵🇰 {t("language.urdu")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#2BDF88] hover:text-gray-700 focus:outline-none transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <GrClose className="h-6 w-6" />
                ) : (
                  <GiHamburgerMenu className="h-6 w-6 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mobile-menu-container">
            <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${currentLocale}${item.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-3 text-base font-medium transition-colors duration-200 ${
                    pathname.includes(item.href)
                      ? "text-[#2BDF88] bg-[#f4fdf9]"
                      : "text-[#151515] hover:text-[#2BDF88] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Language Options in Mobile Menu */}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-sm font-medium text-gray-500 mb-2">
                  {t("language.label")}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleLanguageChange("en");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentLocale === "en"
                        ? "bg-[#3d9970] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    🇺🇸 {t("language.english")}
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange("ur");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentLocale === "ur"
                        ? "bg-[#3d9970] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    🇵🇰 {t("language.urdu")}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isLogin ? (
                  <>
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 overflow-hidden rounded-full mr-3">
                        <Image
                          src="/assets/profileImage.png"
                          alt="User Profile"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.userName || "User"}
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/${locale}/history`)}
                          className="w-full px-4 py-3 xl:py-[1vw] xl:px-[1.5vw] text-left text-gray-700 text-sm xl:text-[1.2vw] hover:bg-[#f4fdf9] hover:text-[#2BDF88] transition-colors duration-200"
                        >
                          {t("userDropdown.history")}
                        </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-red-500 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      {t("mobileMenu.logout")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openModal("signup")}
                    className="w-full bg-[#2BDF88] px-4 py-3 text-base rounded-lg text-white font-bold hover:bg-[#25c778] transition-colors duration-200"
                  >
                    {t("authButton")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      {isModalOpen && modalType === "signup" && (
        <SignUp
          isOpen={isModalOpen}
          onClose={closeModal}
          toggleModal={openModal}
        />
      )}
      {isModalOpen && modalType === "login" && (
        <Login
          isOpen={isModalOpen}
          onClose={closeModal}
          toggleModal={openModal}
        />
      )}
    </>
  );
};

export default Navbar;