"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/userSlice";
import AuthShell from "./Login/AuthShell";
import AuthField, { authSubmitClass } from "./Login/AuthField";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SignUp({ isOpen, onClose, toggleModal }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations("auth.signup");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const { userName, email, password } = formData;
    if (!userName || !email || !password) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        userName,
        email,
        password,
      });

      const data = res.data ?? {};
      dispatch(
        setUser({
          id: data.id || data.data?.id || data.userId || "",
          userName: data.userName || data.name || data.data?.userName || userName,
          email: data.email || data.data?.email || email,
          token: data.access_token || data.token || data.data?.access_token || "",
        })
      );

      onClose();
      router.push(`/${locale}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || t("failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AuthShell title={t("title")} subtitle={t("subtitle")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          label={t("name")}
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          autoComplete="name"
          error={formSubmitted && !formData.userName ? t("errors.name") : ""}
        />
        <AuthField
          label={t("email")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          error={formSubmitted && !formData.email ? t("errors.email") : ""}
        />
        <AuthField
          label={t("password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          error={formSubmitted && !formData.password ? t("errors.password") : ""}
        />

        <button type="submit" disabled={loading} className={authSubmitClass}>
          {t("submit")}
        </button>

        <p className="text-center text-sm text-gray-600">
          {t("haveAccount")}{" "}
          <button
            type="button"
            onClick={() => toggleModal("login")}
            className="cursor-pointer font-semibold text-brand-600 hover:underline"
          >
            {t("login")}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
