"use client";
import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  Leaf,
  Droplets,
  AlertTriangle,
  Shield,
  CheckCircle,
  Activity,
  Heart,
  Check,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Shared card chrome so every result panel reads as one family. */
const ResultCard = ({ icon: Icon, iconClass, title, children }) => (
  <section className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card sm:p-7">
    <div className="mb-5 flex items-center gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold text-balance text-gray-900 sm:text-xl">
        {title}
      </h3>
    </div>
    {children}
  </section>
);

const EmptyItem = ({ children }) => (
  <li className="text-sm text-gray-500 italic">{children}</li>
);

const DetectionPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState("wheat");
  const userId = useSelector((state) => state.user.user.id);
  const t = useTranslations("detectionPage");
  const locale = useLocale();

  // Object URLs leak until revoked; drop each one when it is replaced.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setResult(null);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error(t("alerts.noImage"));
      return;
    }
    if (!userId) {
      toast.error(t("alerts.notLoggedIn"));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("cropType", cropType);
      formData.append("userId", userId);
      formData.append("file", selectedImage);
      formData.append("locale", locale);

      const response = await fetch(`${API_BASE_URL}/predict/predict-disease/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "validation_failed") {
        toast.error(`${data.message}\n${data.details}`, {
          duration: 5000,
          icon: "🚫",
          style: { background: "#FEE2E2", color: "#991B1B" },
        });
        clearImage();
        return;
      }

      if (!response.ok) throw new Error(data.detail || "Prediction failed");

      setResult({
        disease: data.predictedDisease,
        cropType,
        isHealthy: data.is_healthy,
        report: {
          description: data.report?.description || t("results.noDescription"),
          symptoms: data.report?.symptoms || [],
          solutions: data.report?.solutions || [],
          treatmentSteps: data.report?.treatmentSteps || [],
          prevention: data.report?.prevention || [],
          preventiveGuidelines: data.report?.preventiveGuidelines || [],
        },
      });
    } catch (error) {
      toast.error(t("alerts.error", { errorMessage: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-50 to-emerald-50 py-14 sm:py-16 lg:py-20">
      {/* One shell for the whole page: the header, the upload card and every
          result grid now share a single measure and a single gutter. */}
      <div className="shell">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-3xl font-bold text-balance text-gray-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-base text-gray-600 text-pretty sm:text-lg">
            {t("subtitle")}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 rounded-3xl bg-white p-5 shadow-card sm:mt-12 sm:p-8"
        >
          {/* The selector used to float unlabelled above the card. */}
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label
              htmlFor="cropType"
              className="shrink-0 text-sm font-semibold text-gray-700"
            >
              {t("cropSelector.label")}
            </label>
            <select
              id="cropType"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-brand-400 sm:w-52"
            >
              <option value="wheat">{t("cropSelector.wheat")}</option>
              <option value="cotton">{t("cropSelector.cotton")}</option>
            </select>
          </div>

          <label
            htmlFor="imageUpload"
            className={`block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              preview
                ? "border-brand-500 bg-brand-50/40"
                : "border-gray-300 bg-gray-50/60 hover:border-brand-400 hover:bg-brand-50/40"
            }`}
          >
            {preview ? (
              <div className="flex h-56 items-center justify-center p-3 sm:h-72 lg:h-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={selectedImage?.name || "Selected leaf"}
                  className="h-full w-full rounded-xl object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:py-20">
                <UploadCloud
                  className="mb-4 h-12 w-12 text-brand-500 sm:h-16 sm:w-16"
                  aria-hidden="true"
                />
                <p className="text-base font-semibold text-balance text-gray-700 sm:text-lg">
                  {t("uploadSection.title")}
                </p>
                <p className="mt-1.5 text-sm text-gray-500">
                  {t("uploadSection.subtitle")}
                </p>
              </div>
            )}
          </label>

          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />

          {selectedImage && (
            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-gray-600">
                {selectedImage.name}
              </span>
              <button
                type="button"
                onClick={clearImage}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t("uploadSection.change")}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !selectedImage}
            className="mt-6 w-full cursor-pointer rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-600 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:text-lg"
          >
            {loading ? t("loading.analyzing") : t("uploadSection.button")}
          </button>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex flex-col items-center"
            >
              <div
                className="h-11 w-11 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
                role="status"
                aria-label={t("loading.analyzing")}
              />
              <p className="mt-3 text-sm font-medium text-gray-600">
                {t("loading.message")}
              </p>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-8 space-y-6"
            >
              {/* Verdict + description. The previous markup used `w-[40%]`,
                  `w-[10%]` and a hard `ml-20`, which squeezed the description
                  into a one-word-per-line column on phones. */}
              <div className="grid gap-5 md:grid-cols-5">
                <div
                  className={`flex flex-col justify-center rounded-2xl p-6 shadow-card md:col-span-2 ${
                    result.isHealthy ? "bg-brand-50" : "bg-red-50"
                  }`}
                >
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    {t("results.detectedDisease")}
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        result.isHealthy ? "bg-brand-100" : "bg-red-100"
                      }`}
                    >
                      {result.isHealthy ? (
                        <Check className="h-6 w-6 text-brand-600" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                      )}
                    </span>
                    <h2
                      className={`text-xl leading-snug font-bold text-balance sm:text-2xl ${
                        result.isHealthy ? "text-brand-700" : "text-red-600"
                      }`}
                    >
                      {result.disease}
                      {result.isHealthy && (
                        <span className="ms-2 block text-sm font-normal text-brand-700 sm:inline">
                          ({t("results.healthyStatus")})
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-card md:col-span-3">
                  <div className="mb-3 flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-brand-600" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("results.description")}
                    </h3>
                  </div>
                  <p className="leading-relaxed text-gray-700 text-pretty">
                    {result.report.description}
                  </p>
                </div>
              </div>

              {/* Symptoms / solutions / steps. A healthy leaf only produces the
                  symptoms card, so the row collapses to two columns instead of
                  leaving a third of the grid empty. */}
              <div
                className={`grid gap-5 ${
                  result.isHealthy ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                <ResultCard
                  icon={Activity}
                  iconClass="bg-red-100 text-red-600"
                  title={t("results.symptoms")}
                >
                  <ul className="space-y-3">
                    {result.report.symptoms.length > 0 ? (
                      result.report.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"
                          />
                          <span className="text-gray-700">{symptom}</span>
                        </li>
                      ))
                    ) : (
                      <EmptyItem>{t("results.noSymptoms")}</EmptyItem>
                    )}
                  </ul>
                </ResultCard>

                {!result.isHealthy && (
                  <ResultCard
                    icon={Droplets}
                    iconClass="bg-brand-100 text-brand-600"
                    title={t("results.treatmentSolutions")}
                  >
                    <ul className="space-y-3">
                      {result.report.solutions.length > 0 ? (
                        result.report.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle
                              className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                              aria-hidden="true"
                            />
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))
                      ) : (
                        <EmptyItem>{t("results.noSolutions")}</EmptyItem>
                      )}
                    </ul>
                  </ResultCard>
                )}

                {!result.isHealthy && (
                  <ResultCard
                    icon={CheckCircle}
                    iconClass="bg-blue-100 text-blue-600"
                    title={t("results.treatmentSteps")}
                  >
                    <ol className="space-y-4">
                      {result.report.treatmentSteps.length > 0 ? (
                        result.report.treatmentSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                              {index + 1}
                            </span>
                            {/* Was `text-blue-700`, the only body copy on the
                                page that was not neutral grey. */}
                            <span className="pt-0.5 text-gray-700">{step}</span>
                          </li>
                        ))
                      ) : (
                        <EmptyItem>{t("results.noTreatmentSteps")}</EmptyItem>
                      )}
                    </ol>
                  </ResultCard>
                )}

                {result.isHealthy && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 p-7 text-center shadow-card">
                    <Heart className="mb-3 h-12 w-12 text-brand-500" aria-hidden="true" />
                    <h3 className="text-xl font-bold text-balance text-brand-700">
                      {t("results.healthyCelebration.title")}
                    </h3>
                    <p className="mt-2 text-brand-600 text-pretty">
                      {t("results.healthyCelebration.message")}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ResultCard
                  icon={Shield}
                  iconClass="bg-purple-100 text-purple-600"
                  title={t("results.preventionMeasures")}
                >
                  <ul className="space-y-3">
                    {result.report.prevention.length > 0 ? (
                      result.report.prevention.map((measure, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Shield
                            className="mt-0.5 h-5 w-5 shrink-0 text-purple-600"
                            aria-hidden="true"
                          />
                          <span className="text-gray-700">{measure}</span>
                        </li>
                      ))
                    ) : (
                      <EmptyItem>{t("results.noPrevention")}</EmptyItem>
                    )}
                  </ul>
                </ResultCard>

                <ResultCard
                  icon={Shield}
                  iconClass="bg-indigo-100 text-indigo-600"
                  title={t("results.preventiveGuidelines")}
                >
                  <ul className="space-y-3">
                    {result.report.preventiveGuidelines.length > 0 ? (
                      result.report.preventiveGuidelines.map((guideline, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500"
                          />
                          <span className="text-gray-700">{guideline}</span>
                        </li>
                      ))
                    ) : (
                      <EmptyItem>{t("results.noPreventiveGuidelines")}</EmptyItem>
                    )}
                  </ul>
                </ResultCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DetectionPage;
