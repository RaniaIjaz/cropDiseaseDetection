"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import ForgotPasswordModal from "./ForgotPasswordModal";
import OtpModal from "./OtpModal";
import ResetPasswordModal from "./ResetPasswordModal";

const ForgotFlowModal = ({ onClose }) => {
  const [step, setStep] = useState("email");
  const t = useTranslations("auth");

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      data-auth-layer
      onClick={onClose}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black/55 p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="absolute end-3 top-3 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {step === "email" && <ForgotPasswordModal onNext={setStep} />}
          {step === "otp" && <OtpModal onNext={setStep} />}
          {step === "reset" && <ResetPasswordModal onDone={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default ForgotFlowModal;
