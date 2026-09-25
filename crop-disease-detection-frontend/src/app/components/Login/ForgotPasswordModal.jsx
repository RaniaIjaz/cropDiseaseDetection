"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import AuthField, { authSubmitClass } from "./AuthField";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ForgotPasswordModal = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth.forgot");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("required"));
      return;
    }

    setLoading(true);
    try {
      // The endpoint declares `email: EmailStr = Body(...)`, so it takes the
      // bare string rather than an object.
      await axios.post(`${API_BASE_URL}/auth/forget-password`, email);
      toast.success(t("sent"));
      localStorage.setItem("resetEmail", email);
      onNext("otp");
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthField
          label={t("email")}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <button type="submit" disabled={loading} className={authSubmitClass}>
          {loading ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordModal;
