"use client";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { authSubmitClass } from "./AuthField";

const LENGTH = 6;

const OtpModal = ({ onNext }) => {
  const [otp, setOtp] = useState(Array(LENGTH).fill(""));
  const inputRefs = useRef([]);
  const t = useTranslations("auth.otp");

  const setDigit = (index, value) => {
    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = value;
      return nextOtp;
    });
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    setDigit(index, value);
    if (value && index < LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Pasting the whole code from an email is the common case.
  const handlePaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!digits) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    digits.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputRefs.current[Math.min(digits.length, LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      toast.error(t("incomplete"));
      return;
    }
    localStorage.setItem("resetOtp", otp.join(""));
    toast.success(t("verified"));
    onNext("reset");
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-gray-900">{t("title")}</h2>
      <p className="mt-2 text-center text-sm text-gray-500 text-pretty">
        {t("subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        {/* `dir="ltr"` keeps the digit order stable when the page is RTL. */}
        <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              ref={(el) => (inputRefs.current[index] = el)}
              className="h-12 w-10 rounded-xl border border-gray-300 text-center text-lg font-semibold text-gray-900 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none sm:h-14 sm:w-12"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button type="submit" className={`${authSubmitClass} mt-6`}>
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default OtpModal;
