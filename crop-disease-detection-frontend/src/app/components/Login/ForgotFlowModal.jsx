"use client";

import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import OtpModal from "./OtpModal";
import ResetPasswordModal from "./ResetPasswordModal";

const ForgotFlowModal = ({ onClose }) => {
  const [step, setStep] = useState("email");

  const handleNext = (nextStep) => {
    setStep(nextStep);
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div
      onClick={handleDone}
      className="fixed inset-0 flex justify-center items-center  bg-opacity-50  text-black bg-black/50 backdrop-blur-md z-50"
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] md:w-[40vw] md:max-w-none max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "email" && <ForgotPasswordModal onNext={handleNext} />}
        {step === "otp" && <OtpModal onNext={handleNext} />}
        {step === "reset" && <ResetPasswordModal onDone={handleDone} />}
      </div>
    </div>
  );
};

export default ForgotFlowModal;
