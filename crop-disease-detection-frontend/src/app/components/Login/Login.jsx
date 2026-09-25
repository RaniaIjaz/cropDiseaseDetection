"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import axios from "axios";
import ForgotFlowModal from "./ForgotFlowModal";
import AuthShell from "./AuthShell";
import AuthField, { authSubmitClass } from "./AuthField";
import { setUser } from "../../redux/slices/userSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login({ isOpen, onClose, toggleModal }) {
  const dispatch = useDispatch();
  const t = useTranslations("auth.login");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const { email, password } = formData;
    if (!email || !password) {
      toast.error(t("fillAll"));
      return;
    }

    setLoading(true);
    try {
      const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token } = loginRes.data;

      const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
        params: { token: access_token },
      });

      dispatch(setUser({ ...userRes.data, token: access_token }));
      toast.success(t("success"));
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || t("failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AuthShell title={t("title")} subtitle={t("subtitle")} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            label={t("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            error={formSubmitted && !formData.email ? t("fillAll") : ""}
          />
          <AuthField
            label={t("password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            error={formSubmitted && !formData.password ? t("fillAll") : ""}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="cursor-pointer text-sm font-medium text-brand-600 hover:underline"
            >
              {t("forgot")}
            </button>
          </div>

          <button type="submit" disabled={loading} className={authSubmitClass}>
            {t("submit")}
          </button>

          <p className="text-center text-sm text-gray-600">
            {t("noAccount")}{" "}
            <button
              type="button"
              onClick={() => toggleModal("signup")}
              className="cursor-pointer font-semibold text-brand-600 hover:underline"
            >
              {t("signup")}
            </button>
          </p>
        </form>
      </AuthShell>

      {/* Rendered as a sibling, not as a third flex child of the login card,
          so it can never take part in that card's layout. */}
      {showForgot && <ForgotFlowModal onClose={() => setShowForgot(false)} />}
    </>
  );
}
