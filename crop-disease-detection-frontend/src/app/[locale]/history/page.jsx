"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Loader2,
  AlertCircle,
  User,
  X,
  Droplets,
  Shield,
  AlertTriangle,
  CheckCircle,
  Sprout,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* Categorical slots for the crop pie, in fixed order. The previous list was a
   single-hue green ramp, which left two adjacent slices nearly identical. This
   trio clears the all-pairs colour-vision and normal-vision separation floors
   on a light surface; beyond three crops the tail folds into a neutral
   "Other" slice rather than cycling into unvalidated hues. */
const CROP_COLORS = ["#1baf7a", "#2a78d6", "#eb6834"];
const OTHER_COLOR = "#8a8a82";
const MAX_CROP_SLICES = CROP_COLORS.length;

/** Counts rows by one of their fields, e.g. tally(rows, "crop"). */
const tally = (rows, key) =>
  rows.reduce((acc, item) => {
    if (!item[key]) return acc;
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});

const RAD = Math.PI / 180;

/* Recharts tints pie labels with the slice fill, so a string-returning `label`
   puts series colour on text. Rendering the node explicitly keeps labels in the
   neutral ink token while still sitting outside the slice. */
const renderCropLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RAD);
  const y = cy + radius * Math.sin(-midAngle * RAD);

  return (
    <text
      x={x}
      y={y}
      fill="#52514e"
      fontSize={13}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/** Card shell shared by all three charts, so they line up and so an empty
 *  dataset shows a message instead of a blank 300px box. */
const ChartCard = ({
  title,
  badge,
  hasData,
  emptyLabel,
  delay = 0,
  legend,
  children,
}) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-2xl bg-white p-5 shadow-card sm:p-6"
  >
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
        {title}
      </h2>
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
        {badge}
      </span>
    </div>
    {hasData ? (
      /* Recharts lays its SVG out left-to-right; under `dir="rtl"` the rotated
         category labels anchor the wrong way and get clipped. Axes stay LTR
         while the label text itself still shapes right-to-left. */
      <>
        <div dir="ltr" className="h-64 w-full sm:h-72">
          {children}
        </div>
        {/* The legend is HTML, so it stays in the page direction. */}
        {legend}
      </>
    ) : (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 text-center sm:h-72">
        <BarChart3 className="h-9 w-9 text-gray-300" aria-hidden="true" />
        <p className="max-w-xs px-4 text-sm text-gray-500 text-pretty">
          {emptyLabel}
        </p>
      </div>
    )}
  </motion.section>
);

const StatCard = ({
  label,
  badge,
  badgeClass,
  value,
  valueClass,
  caption,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-2xl bg-white p-5 shadow-card sm:p-6"
  >
    <div className="mb-3 flex items-start justify-between gap-2">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${badgeClass}`}>
        {badge}
      </span>
    </div>
    <p className={`mb-1 font-bold break-words ${valueClass}`}>{value}</p>
    <p className="text-sm text-gray-500">{caption}</p>
  </motion.div>
);

const HistoryPage = () => {
  const router = useRouter();
  const { user, isLogin } = useSelector((state) => state.user);
  const t = useTranslations("historyPage");
  const currentLocale = useLocale();
  const dateLocale = currentLocale === "ur" ? "ur-PK" : "en-US";

  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cropCounts, setCropCounts] = useState({});
  const [diseaseCounts, setDiseaseCounts] = useState({});
  const [totalReports, setTotalReports] = useState(0);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const userName = user?.userName || t("defaultUserName");

  const transformBackendData = useCallback(
    (reports) =>
      reports.map((report) => ({
        id: report.id,
        imageUrl: report.imageUrl,
        disease: report.predictedDisease,
        crop: report.cropType,
        description: report.description,
        suggestion: report.solutions?.join(". ") || t("noTreatmentSuggested"),
        date: new Date(report.createdAt).toISOString().split("T")[0],
        confidence: report.confidence,
        symptoms: report.symptoms || [],
        solutions: report.solutions || [],
        prevention: report.prevention || [],
        treatmentSteps: report.treatmentSteps || [],
        preventiveGuidelines: report.preventiveGuidelines || [],
        createdAt: report.createdAt,
        originalData: report,
      })),
    [t],
  );

  const fetchDetailedReport = async (reportId) => {
    try {
      setModalLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch report details: ${response.status}`);
      }
      return await response.json();
    } finally {
      setModalLoading(false);
    }
  };

  const handleDiseaseClick = async (item) => {
    setSelectedDisease({ ...item, detailedData: null });
    try {
      const detailedData = await fetchDetailedReport(item.id);
      setSelectedDisease({ ...item, detailedData });
    } catch {
      setSelectedDisease({
        ...item,
        detailedData: null,
        error: t("modal.loadError"),
      });
    }
  };

  const closeModal = () => setSelectedDisease(null);

  useEffect(() => {
    if (!isLogin) router.push(`/${currentLocale}/`);
  }, [isLogin, router, currentLocale]);

  // Escape closes the detail dialog, and the page behind it stops scrolling.
  useEffect(() => {
    if (!selectedDisease) return;
    const onKeyDown = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedDisease]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isLogin || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/reports/user/${user.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push(`/${currentLocale}/`);
            return;
          }
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = transformBackendData(data.reports);
        setHistory(transformedData);
        setCropCounts(data.cropCounts || {});
        setDiseaseCounts(data.diseaseCounts || {});
        setTotalReports(data.totalReports ?? transformedData.length);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.message || t("fetchError"));

        if (process.env.NODE_ENV === "development") {
          const mockHistory = [
            {
              id: 1,
              imageUrl: "/assets/wheat.png",
              disease: "Wheat Leaf Rust",
              crop: t("crops.wheat"),
              description: t("mockData.wheatRust.description"),
              suggestion: t("mockData.wheatRust.suggestion"),
              date: "2025-10-14",
              confidence: 95.5,
              symptoms: [0, 1, 2, 3].map((i) =>
                t(`mockData.wheatRust.symptoms.${i}`),
              ),
              solutions: [0, 1, 2].map((i) =>
                t(`mockData.wheatRust.solutions.${i}`),
              ),
              prevention: [0, 1, 2].map((i) =>
                t(`mockData.wheatRust.prevention.${i}`),
              ),
              treatmentSteps: [0, 1, 2].map((i) =>
                t(`mockData.wheatRust.treatmentSteps.${i}`),
              ),
              preventiveGuidelines: [0, 1, 2].map((i) =>
                t(`mockData.wheatRust.preventiveGuidelines.${i}`),
              ),
            },
            {
              id: 2,
              imageUrl: "/assets/cotton1.png",
              disease: "Cotton Leaf Curl Virus",
              crop: t("crops.cotton"),
              description: t("mockData.cottonVirus.description"),
              suggestion: t("mockData.cottonVirus.suggestion"),
              date: "2025-10-15",
              confidence: 87.2,
              symptoms: [0, 1, 2, 3].map((i) =>
                t(`mockData.cottonVirus.symptoms.${i}`),
              ),
              solutions: [0, 1, 2].map((i) =>
                t(`mockData.cottonVirus.solutions.${i}`),
              ),
              prevention: [0, 1, 2].map((i) =>
                t(`mockData.cottonVirus.prevention.${i}`),
              ),
              treatmentSteps: [0, 1, 2].map((i) =>
                t(`mockData.cottonVirus.treatmentSteps.${i}`),
              ),
              preventiveGuidelines: [0, 1, 2].map((i) =>
                t(`mockData.cottonVirus.preventiveGuidelines.${i}`),
              ),
            },
          ];
          setHistory(mockHistory);
          setTotalReports(mockHistory.length);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isLogin, user.id, router, currentLocale, t, transformBackendData]);

  /* The backend supplies cropCounts / diseaseCounts, but they are empty
     whenever the fallback data is in use — which made the header report
     "0 crops, 0 diseases" next to a list of detections. Derive them from the
     rows whenever the server did not send them. */
  const effectiveCropCounts = useMemo(
    () =>
      Object.keys(cropCounts).length ? cropCounts : tally(history, "crop"),
    [cropCounts, history],
  );
  const effectiveDiseaseCounts = useMemo(
    () =>
      Object.keys(diseaseCounts).length
        ? diseaseCounts
        : tally(history, "disease"),
    [diseaseCounts, history],
  );

  const filtered = useMemo(() => {
    let results = history;

    if (search.trim()) {
      const needle = search.toLowerCase();
      results = results.filter((item) =>
        item.disease?.toLowerCase().includes(needle),
      );
    }
    if (diseaseFilter) {
      results = results.filter((item) => item.disease === diseaseFilter);
    }
    if (startDate) {
      results = results.filter(
        (item) => new Date(item.date) >= new Date(startDate),
      );
    }
    if (endDate) {
      results = results.filter(
        (item) => new Date(item.date) <= new Date(endDate),
      );
    }
    return results;
  }, [search, diseaseFilter, startDate, endDate, history]);

  const hasActiveFilters = Boolean(
    search || diseaseFilter || startDate || endDate,
  );

  const formatDate = useCallback(
    (value, opts) => new Date(value).toLocaleDateString(dateLocale, opts),
    [dateLocale],
  );

  const mostCommonDisease = useMemo(() => {
    if (!filtered.length) return t("notAvailable");
    const counts = filtered.reduce((acc, curr) => {
      acc[curr.disease] = (acc[curr.disease] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [filtered, t]);

  const mostRecentDate = filtered.length
    ? formatDate(Math.max(...filtered.map((item) => new Date(item.date))), {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : t("notAvailable");

  const diseaseFrequency = useMemo(
    () =>
      Object.entries(effectiveDiseaseCounts)
        .map(([name, count]) => ({
          name: name.length > 15 ? `${name.slice(0, 15)}…` : name,
          fullName: name,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    [effectiveDiseaseCounts],
  );

  const groupedDetections = useMemo(() => {
    const byDate = filtered.reduce((acc, item) => {
      const key = formatDate(item.date, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(byDate)
      .map(([date, detections]) => ({ date, detections }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filtered, formatDate]);

  const cropDistribution = useMemo(() => {
    const sorted = Object.entries(effectiveCropCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    if (sorted.length <= MAX_CROP_SLICES) {
      return sorted.map((slice, i) => ({ ...slice, color: CROP_COLORS[i] }));
    }

    const head = sorted
      .slice(0, MAX_CROP_SLICES)
      .map((slice, i) => ({ ...slice, color: CROP_COLORS[i] }));
    const tail = sorted.slice(MAX_CROP_SLICES);
    return [
      ...head,
      {
        name: t("charts.other"),
        value: tail.reduce((sum, slice) => sum + slice.value, 0),
        color: OTHER_COLOR,
      },
    ];
  }, [effectiveCropCounts, t]);

  const copyDetails = async () => {
    const text = `${t("modal.disease")}: ${selectedDisease.disease}\n${t(
      "modal.crop",
    )}: ${selectedDisease.crop}\n${t("modal.description")}: ${
      selectedDisease.description
    }`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("modal.copiedAlert"));
    } catch {
      toast.error(t("modal.loadError"));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-50">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 h-11 w-11 animate-spin text-brand-600"
            aria-hidden="true"
          />
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-50 to-emerald-50 py-12 sm:py-14 lg:py-16">
      <div className="shell">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:text-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100">
              <User className="h-7 w-7 text-brand-600" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-1 text-gray-600">
                {t("welcomeMessage")}{" "}
                <span className="font-semibold text-brand-700">{userName}</span>
              </p>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-pretty">
            {t("subtitle")}
          </p>
          {error && (
            <p className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-start text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {error} {t("showingFallback")}
              </span>
            </p>
          )}
        </motion.header>

        {/* Totals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 grid grid-cols-3 gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-600 p-5 text-white shadow-lg sm:gap-4 sm:p-6"
        >
          {[
            { value: totalReports, label: t("stats.totalDetections") },
            {
              value: Object.keys(effectiveCropCounts).length,
              label: t("stats.differentCrops"),
            },
            {
              value: Object.keys(effectiveDiseaseCounts).length,
              label: t("stats.diseasesDetected"),
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
              <div className="mt-0.5 text-xs opacity-90 text-pretty sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-card sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">
            {t("filters.title")}
          </h2>
          {/* A 4-up row only fits from `lg`; below that it becomes two columns
              and then one, instead of four crushed 90px controls. */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
              <Search
                className="h-4 w-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label={t("filters.searchPlaceholder")}
                placeholder={t("filters.searchPlaceholder")}
                className="w-full bg-transparent text-sm text-gray-700 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              aria-label={t("filters.allDiseases")}
              className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
            >
              <option value="">{t("filters.allDiseases")}</option>
              {Object.keys(effectiveDiseaseCounts).map((disease) => (
                <option key={disease} value={disease}>
                  {disease} ({effectiveDiseaseCounts[disease]})
                </option>
              ))}
            </select>

            <div className="relative">
              <Calendar
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="date"
                aria-label={t("filters.title")}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pe-3 ps-9 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="relative">
              <Calendar
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                type="date"
                aria-label={t("filters.title")}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pe-3 ps-9 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            delay={0.05}
            label={t("summary.filteredResults")}
            badge={t("summary.active")}
            badgeClass="bg-brand-100 text-brand-800"
            value={filtered.length}
            valueClass="text-3xl text-brand-600"
            caption={`${t("summary.outOf")} ${totalReports} ${t(
              "summary.totalDetections",
            )}`}
          />
          <StatCard
            delay={0.1}
            label={t("summary.mostCommon")}
            badge={t("summary.disease")}
            badgeClass="bg-blue-100 text-blue-800"
            value={mostCommonDisease}
            valueClass="text-lg text-gray-800"
            caption={t("summary.inFilteredResults")}
          />
          <StatCard
            delay={0.15}
            label={t("summary.mostRecent")}
            badge={t("summary.latest")}
            badgeClass="bg-purple-100 text-purple-800"
            value={mostRecentDate}
            valueClass="text-lg text-gray-800"
            caption={t("summary.lastDetection")}
          />
        </div>

        {/* Charts. The category bar chart takes the full row: its rotated
            disease names need the width. The timeline and the crop split
            share the row below, so no card is left half empty. */}
        <div className="mt-8 space-y-5">
          <ChartCard
            delay={0.2}
            title={t("charts.topDiseases")}
            badge={t("charts.top10")}
            hasData={diseaseFrequency.length > 0}
            emptyLabel={t("noDetections.noDetectionsYet")}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diseaseFrequency}
                margin={{ top: 4, right: 8, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={56}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${t("charts.detections")}`,
                    t("charts.count"),
                  ]}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.fullName || label
                  }
                  labelStyle={{ color: "#286249" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                  }}
                />
                {/* Capped so two categories do not render as two slabs. */}
                <Bar
                  dataKey="count"
                  fill="#3d9970"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard
              delay={0.25}
              title={t("charts.timeline")}
              badge={t("charts.daily")}
              hasData={groupedDetections.length > 0}
              emptyLabel={t("noDetections.noDetectionsYet")}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={groupedDetections}
                  margin={{ top: 4, right: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value} ${t("charts.detections")}`,
                      t("charts.count"),
                    ]}
                    labelStyle={{ color: "#286249" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="detections"
                    stroke="#3d9970"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "#3d9970",
                      fill: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard
              delay={0.3}
              title={t("charts.cropDistribution")}
              badge={t("charts.byDetectionCount")}
              hasData={cropDistribution.length > 0}
              emptyLabel={t("noDetections.noDetectionsYet")}
              legend={
                <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
                  {cropDistribution.map((entry) => (
                    <li
                      key={entry.name}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name}
                    </li>
                  ))}
                </ul>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropDistribution}
                    cx="50%"
                    cy="50%"
                    /* Leaves room for the outside labels inside the card. */
                    outerRadius="62%"
                    dataKey="value"
                    /* Direct labels are the relief for the lower-contrast
                         slot, and keep identity off colour alone. */
                    label={renderCropLabel}
                    labelLine={false}
                    /* 2px surface gap between neighbouring slices. */
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {cropDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${value} ${t("charts.detections")}`,
                      t("charts.count"),
                    ]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Detections */}
        <div className="mt-10">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {t("detections.title")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("detections.showing")} {filtered.length} {t("detections.of")}{" "}
              {totalReports}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-card sm:p-12">
              <Search
                className="mx-auto mb-4 h-14 w-14 text-gray-300"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold text-gray-700 sm:text-xl">
                {t("noDetections.title")}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-gray-500 text-pretty">
                {hasActiveFilters
                  ? t("noDetections.tryAdjusting")
                  : t("noDetections.noDetectionsYet")}
              </p>
              {!hasActiveFilters && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/${currentLocale}/disease-detection`)
                  }
                  className="mt-5 cursor-pointer rounded-xl bg-brand-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-600"
                >
                  {t("noDetections.startDetection")}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filtered.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 6) * 0.05 }}
                  className="flex cursor-pointer flex-col gap-5 rounded-3xl bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:flex-row sm:p-6"
                  onClick={() => handleDiseaseClick(item)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.disease}
                    loading="lazy"
                    className="h-44 w-full shrink-0 rounded-2xl bg-gray-50 object-cover sm:h-40 sm:w-40"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/leaf.png";
                      e.currentTarget.className =
                        "h-44 w-full shrink-0 rounded-2xl bg-gray-50 object-contain p-6 sm:h-40 sm:w-40";
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {item.crop}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500">
                        {formatDate(item.date, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                      {item.disease}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">
                      {item.description || t("noDescription")}
                    </p>

                    {item.symptoms?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.symptoms.slice(0, 3).map((symptom, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                          >
                            {symptom}
                          </span>
                        ))}
                        {item.symptoms.length > 3 && (
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            +{item.symptoms.length - 3} {t("detections.more")}
                          </span>
                        )}
                      </div>
                    )}

                    {item.suggestion &&
                      item.suggestion !== t("noTreatmentSuggested") && (
                        <div className="mt-3 rounded-lg bg-brand-50 p-3">
                          <p className="text-xs font-semibold text-brand-800">
                            💡 {t("detections.recommendedAction")}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-brand-700">
                            {item.suggestion}
                          </p>
                        </div>
                      )}

                    {/* Wraps on narrow cards instead of squeezing "View
                        Details" into a two-line stub next to the date. */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {formatDate(item.date, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 font-medium whitespace-nowrap text-brand-600 transition-colors hover:text-brand-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiseaseClick(item);
                        }}
                      >
                        {t("detections.viewDetails")}
                        <ChevronRight
                          className="h-4 w-4 flip-rtl"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail dialog */}
      <AnimatePresence>
        {selectedDisease && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedDisease.disease}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-3xl"
            >
              {/* Header */}
              <div className="shrink-0 border-b border-gray-200 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
                      {selectedDisease.crop}
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                      {selectedDisease.disease}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 text-pretty">
                      {selectedDisease.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label={t("modal.close")}
                    className="shrink-0 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* The stray `h-8 w-px` rule that used to sit here divided
                    nothing — it was left over from a removed stat. */}
                <div className="mt-4 flex items-center gap-2.5">
                  <Calendar
                    className="h-5 w-5 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("modal.detectedOn")}{" "}
                      {formatDate(selectedDisease.date, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("modal.detectionDate")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
                {modalLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12">
                    <Loader2
                      className="h-7 w-7 animate-spin text-brand-600"
                      aria-hidden="true"
                    />
                    <span className="text-gray-600">{t("modal.loading")}</span>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <section>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <span className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <Sprout className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {t("modal.plantImage")}
                      </h3>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedDisease.imageUrl}
                        alt={selectedDisease.disease}
                        className="mx-auto max-h-72 w-auto max-w-full rounded-2xl object-contain shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/leaf.png";
                        }}
                      />
                    </section>

                    <section>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <span className="rounded-lg bg-red-100 p-2 text-red-600">
                          <AlertTriangle
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                        {t("modal.symptoms")}
                      </h3>
                      {selectedDisease.symptoms?.length > 0 ? (
                        <ul className="grid gap-2.5 sm:grid-cols-2">
                          {selectedDisease.symptoms.map((symptom, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500"
                              />
                              <span className="text-sm text-gray-700">
                                {symptom}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {t("modal.noSymptoms")}
                        </p>
                      )}
                    </section>

                    <section>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <span className="rounded-lg bg-brand-100 p-2 text-brand-600">
                          <Droplets className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {t("modal.solutions")}
                      </h3>
                      {selectedDisease.solutions?.length > 0 ? (
                        <ul className="space-y-2.5">
                          {selectedDisease.solutions.map((solution, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 rounded-xl bg-brand-50 p-3.5"
                            >
                              <CheckCircle
                                className="mt-0.5 h-5 w-5 shrink-0 text-brand-600"
                                aria-hidden="true"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {solution}
                                </p>
                                {selectedDisease.treatmentSteps?.[index] && (
                                  <p className="mt-1 text-sm text-gray-600">
                                    {selectedDisease.treatmentSteps[index]}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {t("modal.noSolutions")}
                        </p>
                      )}
                    </section>

                    <section>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                        <span className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <Shield className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {t("modal.prevention")}
                      </h3>
                      {selectedDisease.prevention?.length > 0 ? (
                        <ul className="grid gap-2.5 sm:grid-cols-2">
                          {selectedDisease.prevention.map(
                            (prevention, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 rounded-xl bg-blue-50 p-3"
                              >
                                <Shield
                                  className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                                  aria-hidden="true"
                                />
                                <span className="text-sm text-gray-700">
                                  {prevention}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {t("modal.noPrevention")}
                        </p>
                      )}
                    </section>

                    {selectedDisease.error && (
                      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        {selectedDisease.error}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer — stacks on phones, where three buttons in a row forced
                  every label onto two lines. */}
              <div className="shrink-0 border-t border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {t("modal.close")}
                  </button>
                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <button
                      type="button"
                      onClick={copyDetails}
                      className="cursor-pointer rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      {t("modal.copyDetails")}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="cursor-pointer rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                    >
                      {t("modal.printReport")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;
