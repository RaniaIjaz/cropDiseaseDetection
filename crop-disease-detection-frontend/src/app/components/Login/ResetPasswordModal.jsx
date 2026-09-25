"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import AuthField, { authSubmitClass } from "./AuthField";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ResetPasswordModal = ({ onDone }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth.reset");

  const handleReset = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");
    const otp = localStorage.getItem("resetOtp");

    if (!email || !otp) {
      toast.error(t("expired"));
      onDone();
      return;
    }

    if (password.length < 8) {
      toast.error(t("tooShort"));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        new_password: password,
      });
      toast.success(res.data?.msg || t("success"));
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-gray-900">{t("title")}</h2>
      <p className="mt-2 text-center text-sm text-gray-500 text-pretty">
        {t("subtitle")}
      </p>

      <form onSubmit={handleReset} className="mt-6 space-y-4">
        <AuthField
          label={t("password")}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <button type="submit" disabled={loading} className={authSubmitClass}>
          {loading ? t("updating") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordModal;
