"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Filter, 
  Loader2, 
  AlertCircle, 
  User, 
  X, 
  Droplets, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Sprout,
  Clock,
  ChevronRight
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
import { useTranslations,useLocale } from "next-intl";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const HistoryPage = () => {
  const router = useRouter();
  const { user, isLogin } = useSelector((state) => state.user);
  const t = useTranslations("historyPage");
  const currentLocale = useLocale();
  
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [diseaseFilter, setDiseaseFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cropCounts, setCropCounts] = useState({});
  const [diseaseCounts, setDiseaseCounts] = useState({});
  const [totalReports, setTotalReports] = useState(0);
  const [userStats, setUserStats] = useState({
    userName: "",
    detectionCount: 0
  });


  const [selectedDisease, setSelectedDisease] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const transformBackendData = (reports) => {
    return reports.map(report => ({
      id: report.id,
      imageUrl: report.imageUrl,
      disease: report.predictedDisease,
      crop: report.cropType,
      description: report.description,
      suggestion: report.solutions?.join(". ") || t("noTreatmentSuggested"),
      date: new Date(report.createdAt).toISOString().split('T')[0],
      confidence: report.confidence,
      symptoms: report.symptoms || [],
      solutions: report.solutions || [],
      prevention: report.prevention || [],
      treatmentSteps: report.treatmentSteps || [],
      preventiveGuidelines: report.preventiveGuidelines || [],
      createdAt: report.createdAt,
      originalData: report
    }));
  };

  // Function to fetch detailed report data
  const fetchDetailedReport = async (reportId) => {
    try {
      setModalLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report details: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  // Function to handle disease card click
  const handleDiseaseClick = async (item) => {
    try {
      // Set the basic data immediately
      setSelectedDisease({
        ...item,
        detailedData: null
      });

      // Try to fetch detailed data
      const detailedData = await fetchDetailedReport(item.id);
      setSelectedDisease({
        ...item,
        detailedData
      });
    } catch (error) {
      // If detailed fetch fails, still show modal with basic data
      setSelectedDisease({
        ...item,
        detailedData: null,
        error: t("modal.loadError")
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedDisease(null);
  };
  useEffect(() => {
    if (!isLogin) {
      router.push(`/${currentLocale}/`);
    }
  }, [isLogin, router]);

  // Fetch reports from backend
  useEffect(() => {
    const fetchHistory = async () => {
      // Don't fetch if user is not logged in
      if (!isLogin || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/reports/user/${user.id}`, {
          headers: {
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedData = transformBackendData(data.reports);
        setHistory(transformedData);
        setFiltered(transformedData);
        setCropCounts(data.cropCounts || {});
        setDiseaseCounts(data.diseaseCounts || {});
        setTotalReports(data.totalReports || 0);
        setUserStats({
          userName: user.userName || t("defaultUserName"),
          detectionCount: data.totalReports || 0
        });
        
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.message || t("fetchError"));
        
        // Fallback to mock data for development/demo
        if (process.env.NODE_ENV === 'development') {
          const mockHistory = [
            {
              id: 1,
              imageUrl: "/assets/cotton.png",
              disease: "Wheat Leaf Rust",
              crop: t("crops.wheat"),
              description: t("mockData.wheatRust.description"),
              suggestion: t("mockData.wheatRust.suggestion"),
              date: "2025-10-14",
              confidence: 95.5,
              symptoms: [
                t("mockData.wheatRust.symptoms.0"),
                t("mockData.wheatRust.symptoms.1"),
                t("mockData.wheatRust.symptoms.2"),
                t("mockData.wheatRust.symptoms.3")
              ],
              solutions: [
                t("mockData.wheatRust.solutions.0"),
                t("mockData.wheatRust.solutions.1"),
                t("mockData.wheatRust.solutions.2")
              ],
              prevention: [
                t("mockData.wheatRust.prevention.0"),
                t("mockData.wheatRust.prevention.1"),
                t("mockData.wheatRust.prevention.2")
              ],
              treatmentSteps: [
                t("mockData.wheatRust.treatmentSteps.0"),
                t("mockData.wheatRust.treatmentSteps.1"),
                t("mockData.wheatRust.treatmentSteps.2")
              ],
              preventiveGuidelines: [
                t("mockData.wheatRust.preventiveGuidelines.0"),
                t("mockData.wheatRust.preventiveGuidelines.1"),
                t("mockData.wheatRust.preventiveGuidelines.2")
              ]
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
              symptoms: [
                t("mockData.cottonVirus.symptoms.0"),
                t("mockData.cottonVirus.symptoms.1"),
                t("mockData.cottonVirus.symptoms.2"),
                t("mockData.cottonVirus.symptoms.3")
              ],
              solutions: [
                t("mockData.cottonVirus.solutions.0"),
                t("mockData.cottonVirus.solutions.1"),
                t("mockData.cottonVirus.solutions.2")
              ],
              prevention: [
                t("mockData.cottonVirus.prevention.0"),
                t("mockData.cottonVirus.prevention.1"),
                t("mockData.cottonVirus.prevention.2")
              ],
              treatmentSteps: [
                t("mockData.cottonVirus.treatmentSteps.0"),
                t("mockData.cottonVirus.treatmentSteps.1"),
                t("mockData.cottonVirus.treatmentSteps.2")
              ],
              preventiveGuidelines: [
                t("mockData.cottonVirus.preventiveGuidelines.0"),
                t("mockData.cottonVirus.preventiveGuidelines.1"),
                t("mockData.cottonVirus.preventiveGuidelines.2")
              ]
            },
          ];
          setHistory(mockHistory);
          setFiltered(mockHistory);
          setTotalReports(mockHistory.length);
          setUserStats({
            userName: user.userName || t("defaultUserName"),
            detectionCount: mockHistory.length
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isLogin, user.id, user.userName, router, t]);

  // Filter logic
  useEffect(() => {
    let results = history;

    if (search.trim()) {
      results = results.filter((item) =>
        item.disease.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (diseaseFilter) {
      results = results.filter((item) => item.disease === diseaseFilter);
    }

    if (startDate && endDate) {
      results = results.filter(
        (item) =>
          new Date(item.date) >= new Date(startDate) &&
          new Date(item.date) <= new Date(endDate)
      );
    }

    setFiltered(results);
  }, [search, diseaseFilter, startDate, endDate, history]);

  // Calculate most common disease from filtered results
  const mostCommonDisease = filtered.length > 0
    ? Object.entries(
        filtered.reduce((acc, curr) => {
          acc[curr.disease] = (acc[curr.disease] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : t("notAvailable");

  // Get most recent detection date
  const mostRecentDate = filtered.length > 0
    ? new Date(Math.max(...filtered.map(item => new Date(item.date))))
        .toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric' 
        })
    : t("notAvailable");

  // Prepare chart data
  const diseaseFrequency = Object.entries(diseaseCounts)
    .map(([name, count]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      fullName: name,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const detectionsOverTime = filtered.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }),
    detections: 1,
  }));

  // Group detections by date for line chart
  const groupedDetections = Object.entries(
    detectionsOverTime.reduce((acc, curr) => {
      acc[curr.date] = (acc[curr.date] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, detections]) => ({
    date,
    detections
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare pie chart data from cropCounts
  const cropDistribution = Object.entries(cropCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#34d399", "#10b981"];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                {t("title")}
              </h1>
              <p className="text-gray-600 text-lg">
                {t("welcomeMessage")} <span className="font-semibold text-green-700">{userStats.userName}</span>
              </p>
            </div>
          </div>
          <p className="text-gray-600">
            {t("subtitle")}
          </p>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error} {t("showingFallback")}</span>
            </motion.div>
          )}
        </motion.div>

        {/* User Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-10 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{userStats.detectionCount}</div>
              <div className="text-sm opacity-90">{t("stats.totalDetections")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Object.keys(cropCounts).length}</div>
              <div className="text-sm opacity-90">{t("stats.differentCrops")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{Object.keys(diseaseCounts).length}</div>
              <div className="text-sm opacity-90">{t("stats.diseasesDetected")}</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-3xl p-6 mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("filters.title")}</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder={t("filters.searchPlaceholder")}
                className="bg-transparent outline-none w-full text-gray-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border rounded-xl px-3 py-2 bg-gray-50 text-gray-700 w-full"
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
            >
              <option value="">{t("filters.allDiseases")}</option>
              {Object.keys(diseaseCounts).map((disease, i) => (
                <option key={i} value={disease}>
                  {disease} ({diseaseCounts[disease]})
                </option>
              ))}
            </select>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="date"
                className="border rounded-xl pl-10 pr-3 py-2 bg-gray-50 text-gray-700 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="date"
                className="border rounded-xl pl-10 pr-3 py-2 bg-gray-50 text-gray-700 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t("summary.filteredResults")}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {t("summary.active")}
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {filtered.length}
            </div>
            <div className="text-sm text-gray-500">
              {t("summary.outOf")} {totalReports} {t("summary.totalDetections")}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t("summary.mostCommon")}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {t("summary.disease")}
              </span>
            </div>
            <div className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
              {mostCommonDisease}
            </div>
            <div className="text-sm text-gray-500">
              {t("summary.inFilteredResults")}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{t("summary.mostRecent")}</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {t("summary.latest")}
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {mostRecentDate}
            </div>
            <div className="text-sm text-gray-500">
              {t("summary.lastDetection")}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Disease Frequency Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t("charts.topDiseases")}</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {t("charts.top10")}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseaseFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={11}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} ${t("charts.detections")}`, t("charts.count")]}
                  labelFormatter={(label, payload) => {
                    const item = payload[0]?.payload;
                    return item?.fullName || label;
                  }}
                  labelStyle={{ color: '#059669' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#059669" 
                  radius={[8, 8, 0, 0]}
                  name={t("charts.detections")}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Detections Over Time Line Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t("charts.timeline")}</h2>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {t("charts.daily")}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={groupedDetections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} ${t("charts.detections")}`, t("charts.count")]}
                  labelStyle={{ color: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#059669' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name={t("charts.detections")}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t("charts.cropDistribution")}</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {t("charts.byDetectionCount")}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#059669"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {cropDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} ${t("charts.detections")}`, t("charts.count")]}
                labelStyle={{ color: '#059669' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Results Cards */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("detections.title")}
            </h2>
            <div className="text-sm text-gray-500">
              {t("detections.showing")} {filtered.length} {t("detections.of")} {totalReports}
            </div>
          </div>
          
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-lg p-8 text-center"
            >
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("noDetections.title")}</h3>
              <p className="text-gray-500 mb-4">
                {search || diseaseFilter || startDate || endDate 
                  ? t("noDetections.tryAdjusting")
                  : t("noDetections.noDetectionsYet")}
              </p>
              {!search && !diseaseFilter && !startDate && !endDate && (
                <button
                  onClick={() => router.push(`/${currentLocale}/disease-detection`)}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  {t("noDetections.startDetection")}
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleDiseaseClick(item)}
                >
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.disease}
                        className="w-full md:w-48 h-48 object-cover rounded-2xl"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/192/192";
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        {item.crop}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.disease}
                    </h2>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {item.description || t("noDescription")}
                    </p>
                    
                    {item.symptoms && item.symptoms.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">{t("detections.symptoms")}:</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.symptoms.slice(0, 3).map((symptom, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {symptom}
                            </span>
                          ))}
                          {item.symptoms.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              +{item.symptoms.length - 3} {t("detections.more")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {item.suggestion && item.suggestion !== t("noTreatmentSuggested") && (
                      <div className="mb-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800 mb-1">
                          💡 {t("detections.recommendedAction")}:
                        </p>
                        <p className="text-sm text-green-700 line-clamp-2">
                          {item.suggestion}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {t("detections.detectedOn")} {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <button 
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDiseaseClick(item);
                        }}
                      >
                        {t("detections.viewDetails")}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disease Details Modal */}
      <AnimatePresence>
        {selectedDisease && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="bg-white overflow-hidden rounded-3xl shadow-2xl max-w-3xl max-h-[98vh] w-full flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-white border-b p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          {selectedDisease.crop}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedDisease.disease}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedDisease.description}
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-px bg-gray-200" />
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {t("modal.detectedOn")} {new Date(selectedDisease.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">{t("modal.detectionDate")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {modalLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <span className="ml-2 text-gray-600">{t("modal.loading")}</span>
                      </div>
                    ) : (
                      <>
                        {/* Image Section */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <Sprout className="w-5 h-5" />
                            </span>
                            {t("modal.plantImage")}
                          </h3>
                          <div className="flex justify-center">
                            <img
                              src={selectedDisease.imageUrl}
                              alt={selectedDisease.disease}
                              className="max-w-full max-h-80 object-contain rounded-2xl shadow-lg"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/400/300";
                              }}
                            />
                          </div>
                        </div>

                        {/* Symptoms Section */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-red-100 text-red-600 rounded-lg">
                              <AlertTriangle className="w-5 h-5" />
                            </span>
                            {t("modal.symptoms")}
                          </h3>
                          {selectedDisease.symptoms && selectedDisease.symptoms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedDisease.symptoms.map((symptom, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                                >
                                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                  <span className="text-gray-700">{symptom}</span>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">{t("modal.noSymptoms")}</p>
                          )}
                        </div>

                        {/* Solutions Section */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-green-100 text-green-600 rounded-lg">
                              <Droplets className="w-5 h-5" />
                            </span>
                            {t("modal.solutions")}
                          </h3>
                          {selectedDisease.solutions && selectedDisease.solutions.length > 0 ? (
                            <div className="space-y-3">
                              {selectedDisease.solutions.map((solution, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-start gap-3 p-4 bg-green-50 rounded-xl"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-gray-800 font-medium">{solution}</p>
                                    {selectedDisease.treatmentSteps && selectedDisease.treatmentSteps[index] && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {selectedDisease.treatmentSteps[index]}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">{t("modal.noSolutions")}</p>
                          )}
                        </div>

                        {/* Prevention Section */}
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <Shield className="w-5 h-5" />
                            </span>
                            {t("modal.prevention")}
                          </h3>
                          {selectedDisease.prevention && selectedDisease.prevention.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedDisease.prevention.map((prevention, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{prevention}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">{t("modal.noPrevention")}</p>
                          )}
                        </div>

                        {selectedDisease.error && (
                          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <p className="text-yellow-800 text-sm">{selectedDisease.error}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t p-6">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                    >
                      {t("modal.close")}
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${t("modal.disease")}: ${selectedDisease.disease}\n${t("modal.crop")}: ${selectedDisease.crop}\n${t("modal.description")}: ${selectedDisease.description}`
                          );
                          alert(t("modal.copiedAlert"));
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                      >
                        {t("modal.copyDetails")}
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                      >
                        {t("modal.printReport")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryPage;