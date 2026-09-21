"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const DetectionPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState("wheat");
  const userId = useSelector((state) => state.user.user.id);
  const t = useTranslations("detectionPage");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };


  // Update your handleSubmit function in DetectionPage component

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

    // Get current locale from URL or localStorage
    const currentLocale = window.location.pathname.split("/")[1] || "en";
    formData.append("locale", currentLocale);

    const response = await fetch(
      "http://localhost:8000/predict/predict-disease/",
      { method: "POST", body: formData }
    );

    const data = await response.json();
    if (data.status === "validation_failed") {
      toast.error(
        `${data.message}\n${data.details}`,
        {
          duration: 5000,
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            maxWidth: '500px',
          },
          icon: '🚫',
        }
      );
      setSelectedImage(null);
      setPreview(null);
      setLoading(false);
      return; 
    }
    
    if (!response.ok) throw new Error(data.detail || "Prediction failed");
    
    console.log("API Response:", data);

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

  // const handleSubmit = async () => {
  //   if (!selectedImage) {
  //     toast.error(t("alerts.noImage"));
  //     return;
  //   }

  //   if (!userId) {
  //     toast.error(t("alerts.notLoggedIn"));
  //     return;
  //   }

  //   setLoading(true);
  //   setResult(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append("cropType", cropType);
  //     formData.append("userId", userId);
  //     formData.append("file", selectedImage);

  //     // Get current locale from URL or localStorage
  //     const currentLocale = window.location.pathname.split("/")[1] || "en";
  //     formData.append("locale", currentLocale);

  //     const response = await fetch(
  //       "http://localhost:8000/predict/predict-disease/",
  //       { method: "POST", body: formData }
  //     );

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.detail || "Prediction failed");
  //      console.log("API Response:", data);

  //     setResult({
  //       disease: data.predictedDisease,
  //       cropType,
  //       isHealthy: data.is_healthy,
  //       //isHealthy: isHealthy,
  //       report: {
  //         description: data.report?.description || t("results.noDescription"),
  //         symptoms: data.report?.symptoms || [],
  //         solutions: data.report?.solutions || [],
  //         treatmentSteps: data.report?.treatmentSteps || [],
  //         prevention: data.report?.prevention || [],
  //         preventiveGuidelines: data.report?.preventiveGuidelines || [],
  //       },
  //     });
  //   } catch (error) {
  //     toast.error(t("alerts.error", { errorMessage: error.message }));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-20 px-4">
      <div className="mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {t("title")}
            </h1>
            <p className="text-gray-600 text-lg">{t("subtitle")}</p>
          </motion.div>

          {/* Crop Type Selector */}
          <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm"
            >
              <option value="wheat">{t("cropSelector.wheat")}</option>
              <option value="cotton">{t("cropSelector.cotton")}</option>
            </select>
          </div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
          >
            <label
              htmlFor="imageUpload"
              className={`block cursor-pointer border-2 border-dashed rounded-2xl transition-all ${
                preview
                  ? "border-green-500"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {preview ? (
                <div className="relative w-full h-96">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <UploadCloud className="w-16 h-16 text-green-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {t("uploadSection.title")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("uploadSection.subtitle")}
                  </p>
                </div>
              )}
            </label>

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedImage}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? t("loading.analyzing") : t("uploadSection.button")}
            </button>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex flex-col items-center"
              >
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">
                  {t("loading.message")}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white mb-10 rounded-3xl shadow-2xl p-8 md:px-20 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  {/* Left Side: Crop Type & Disease */}
                  <div
                    className={`flex-1 w-[40%] ml-20 rounded-2xl p-6 shadow-inner ${
                      result.isHealthy ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p className="text-sm text-gray-800 font-semibold mb-1">
                      {t("results.detectedDisease")}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result.isHealthy ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {result.isHealthy ? (
                          <Check className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <h3
                        className={`text-2xl md:text-3xl font-bold ${
                          result.isHealthy ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.disease}
                        {result.isHealthy && (
                          <span className="ml-3 text-lg text-green-700 font-normal">
                            ({t("results.healthyStatus")})
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  {/* Right Side: Description */}
                  <div className="flex-1 w-[10%] bg-gray-50 rounded-2xl p-6 shadow-inner">
                    <div className="flex items-center gap-3 mb-4">
                      <Leaf className="w-6 h-6 text-blue-600" />
                      <h4 className="text-xl font-semibold text-gray-900">
                        {t("results.description")}
                      </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {result.report.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show symptoms regardless of health status */}
              <div className="grid md:grid-cols-3 gap-6 px-6">
                {/* Symptoms */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t("results.symptoms")}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {result.report.symptoms.length > 0 ? (
                      result.report.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <span className="w-4 h-4 bg-red-100 rounded-full flex-shrink-0 shadow-md"></span>
                          <span className="text-gray-700 text-lg">
                            {symptom}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">
                        {t("results.noSymptoms")}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Treatment Solutions - Only show if NOT healthy */}
                {!result.isHealthy && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Droplets className="w-6 h-6 text-green-600" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        {t("results.treatmentSolutions")}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {result.report.solutions.length > 0 ? (
                        result.report.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-lg">
                              {solution}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">
                          {t("results.noSolutions")}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Treatment Steps - Only show if NOT healthy */}
                {!result.isHealthy && (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        {t("results.treatmentSteps")}
                      </h3>
                    </div>
                    <ol className="space-y-4">
                      {result.report.treatmentSteps.length > 0 ? (
                        result.report.treatmentSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-blue-700 text-lg pt-1">
                              {step}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">
                          {t("results.noTreatmentSteps")}
                        </li>
                      )}
                    </ol>
                  </div>
                )}

                {/* Show a celebration message for healthy crops instead of empty space */}
                {result.isHealthy && (
                  <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col items-center justify-center h-full">
                      <Heart className="w-16 h-16 text-green-500 mb-4" />
                      <h3 className="text-2xl font-bold text-green-700 mb-2">
                        {t("results.healthyCelebration.title")}
                      </h3>
                      <p className="text-green-600 text-center">
                        {t("results.healthyCelebration.message")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prevention and Guidelines - Show for both healthy and diseased */}
              <div className="grid md:grid-cols-2 mt-10 max-w-4xl mx-auto gap-6 px-6">
                {/* Prevention Measures */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t("results.preventionMeasures")}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {result.report.prevention.length > 0 ? (
                      result.report.prevention.map((measure, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-lg">
                            {measure}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">
                        {t("results.noPrevention")}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Preventive Guidelines */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t("results.preventiveGuidelines")}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {result.report.preventiveGuidelines.length > 0 ? (
                      result.report.preventiveGuidelines.map(
                        (guideline, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700 text-lg">
                              {guideline}
                            </span>
                          </li>
                        )
                      )
                    ) : (
                      <li className="text-gray-500 italic">
                        {t("results.noPreventiveGuidelines")}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DetectionPage;
