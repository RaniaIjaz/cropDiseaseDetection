"use client";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useState } from "react";
// import TermsModal from "./Terms";
// import PrivacyModal from "./Privacy";
import { MdOutlineMailOutline } from "react-icons/md";

const Footer = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    console.log("Subscribed with email:", email);
    setEmail("");
    setError("");
  };

  return (
    <>
      
              
         <div className="mt-6 sm:mt-8 bg-[#3d9970] h-auto sm:h-[70px] xl:h-[10vh] flex items-center text-xs sm:text-sm md:text-[1.2vw] text-white py-4 sm:py-0">
  <div className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-between px-4 sm:px-8 md:px-16">
    
    {/* LEFT SIDE */}
    <span>&copy; {new Date().getFullYear()} AgriDoctor.com</span>

    {/* RIGHT SIDE ICONS */}
    <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-[1.6vh] mt-4 sm:mt-0">
      <Link
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className="text-4xl xl:text-[2.4vw] text-[#aec597] hover:text-pink-500 cursor-pointer transition-colors duration-200" />
      </Link>

      <Link
        href="https://www.linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedinIn className="text-4xl xl:text-[2.2vw] bg-white text-[#aec597] hover:bg-blue-600 rounded-md p-1 cursor-pointer transition-colors duration-200" />
      </Link>
    </div>
  </div>
</div>

      
    </>
  );
};

export default Footer;

