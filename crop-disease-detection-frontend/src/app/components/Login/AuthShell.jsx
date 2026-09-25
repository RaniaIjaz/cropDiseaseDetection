"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Shared chrome for the signup and login dialogs.
 *
 * Previously each modal was `fixed inset-0 flex items-center justify-center`
 * with no padding and no scroll container, so the card ran edge to edge on
 * phones and its lower half became unreachable on short viewports.
 */
export default function AuthShell({ title, subtitle, onClose, children }) {
  const cardRef = useRef(null);
  const t = useTranslations("auth");

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    const onPointerDown = (e) => {
      // Ignore clicks that started inside a nested dialog (the forgot-password
      // flow renders above this one).
      if (e.target.closest("[data-auth-layer]") !== cardRef.current?.closest("[data-auth-layer]")) return;
      if (cardRef.current && !cardRef.current.contains(e.target)) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      data-auth-layer
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/55 p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative flex w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl md:max-w-3xl lg:max-w-4xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="absolute end-3 top-3 z-10 cursor-pointer rounded-full bg-white/80 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Illustration panel — hidden where it would squeeze the form. */}
          <div className="hidden w-1/2 shrink-0 p-4 md:block">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/auth.png"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            </div>
          </div>

          <div className="w-full p-6 sm:p-8 md:w-1/2 md:py-10">
            <h2 className="text-center text-xl font-bold text-balance text-gray-900 sm:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-center text-sm text-gray-500 text-pretty">
                {subtitle}
              </p>
            )}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
