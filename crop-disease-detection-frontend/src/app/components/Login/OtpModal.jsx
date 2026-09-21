
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

const OtpModal = ({ onNext }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    const fullOtp = otp.join("");
    localStorage.setItem("resetOtp", fullOtp);
    toast.success("OTP verified");
    onNext("reset");
  };

  return (
    <div className="p-6 bg-white rounded-[25px] max-w-md w-full">
      <h2 className="text-center font-semibold text-lg mb-6">Enter OTP Code</h2>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              required
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-10 border border-gray-400 text-center text-lg rounded-md focus:ring-2 focus:ring-green-400"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-medium transition duration-200"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default OtpModal;
