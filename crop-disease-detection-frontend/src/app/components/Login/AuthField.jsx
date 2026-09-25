"use client";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

const BASE =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none";

/** One input treatment for every auth form — the old modals mixed a green
 *  border on the first field with default grey borders on the rest. */
export default function AuthField({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  autoComplete,
  ...rest
}) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const t = useTranslations("auth");
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${BASE} ${isPassword ? "pe-11" : ""} ${
            error ? "border-red-400" : "border-gray-300"
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? t("hidePassword") : t("showPassword")}
            className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            {revealed ? (
              <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <Eye className="h-4.5 w-4.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const authSubmitClass =
  "w-full cursor-pointer rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:text-base";
