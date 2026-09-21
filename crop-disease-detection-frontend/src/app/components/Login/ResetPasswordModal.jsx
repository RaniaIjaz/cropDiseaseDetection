import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPasswordModal = ({ onDone }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    if (!email || !otp) {
      toast.error("Session expired. Please try again.");
      onDone();
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/auth/reset-password", {
        email,
        otp,
        new_password: password,
      });
      toast.success(res.data.msg || "Password reset successfully!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      onDone();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-[25px] max-w-md w-full">
      <h2 className="text-center font-semibold text-lg mb-6">Enter New Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-medium transition duration-200"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordModal;
