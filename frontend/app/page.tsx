"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Plane,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Copy,
  Check,
  Search,
  Wallet,
  Globe,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Sun,
  Sunrise,
  Moon,
  Utensils,
  Lightbulb,
  PieChart,
  Award,
  Bus,
  CloudSun,
  ShieldCheck,
  CreditCard,
  Layers,
  FileText,
} from "lucide-react";

interface DailyItineraryItem {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  daily_tip?: string;
}

interface TravelTipItem {
  title: string;
  tip: string;
}

interface FoodRecommendationItem {
  dish: string;
  description: string;
  recommended_spot: string;
}

interface BudgetBreakdownItem {
  category: string;
  percentage: number;
  estimated_amount: number;
  description: string;
}

interface StructuredAiRecommendation {
  trip_overview?: string;
  daily_itinerary?: DailyItineraryItem[];
  travel_tips?: TravelTipItem[];
  food_recommendations?: FoodRecommendationItem[];
  budget_breakdown?: BudgetBreakdownItem[];
}

interface Trip {
  id: number;
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  category: string;
  daily_budget: number;
  travel_style: string;
  travel_month: string;
  ai_recommendation: string;
  created_at?: string;
}

interface TripFormData {
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  travel_style: string;
  travel_month: string;
}

const PRESET_TRIPS: Array<TripFormData & { label: string; icon: string }> = [
  {
    label: "Tokyo Cherry Blossom",
    icon: "🌸",
    destination: "Tokyo",
    country: "Japan",
    days: 7,
    budget: 2500,
    currency: "USD",
    travel_style: "Cultural & Culinary",
    travel_month: "April",
  },
  {
    label: "Bali Island Escapade",
    icon: "🏝️",
    destination: "Bali",
    country: "Indonesia",
    days: 5,
    budget: 8000000,
    currency: "IDR",
    travel_style: "Relaxed & Nature",
    travel_month: "August",
  },
  {
    label: "Paris Romantic Getaway",
    icon: "🗼",
    destination: "Paris",
    country: "France",
    days: 6,
    budget: 3200,
    currency: "EUR",
    travel_style: "Luxury & Sightseeing",
    travel_month: "October",
  },
  {
    label: "Swiss Alps Adventure",
    icon: "🏔️",
    destination: "Interlaken",
    country: "Switzerland",
    days: 8,
    budget: 4500,
    currency: "USD",
    travel_style: "Adventure & Outdoors",
    travel_month: "July",
  },
];

const CURRENCIES = ["USD", "IDR", "EUR", "JPY", "GBP", "SGD", "AUD"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const STYLES = [
  "Backpacker",
  "Cultural & Culinary",
  "Relaxed & Nature",
  "Adventure & Outdoors",
  "Luxury & Sightseeing",
  "Family Friendly",
];

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "Tokyo",
    country: "Japan",
    days: 5,
    budget: 2000,
    currency: "USD",
    travel_style: "Cultural & Culinary",
    travel_month: "April",
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loadingTrips, setLoadingTrips] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "itinerary" | "tips" | "food" | "budget">("all");

  // Check Backend Health
  const checkBackendHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  }, []);

  // Fetch all trips
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/trips`);
      if (!res.ok) {
        throw new Error(`Unable to fetch itineraries (${res.status})`);
      }
      const data: Trip[] = await res.json();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        : [];
      setTrips(sorted);
      setBackendOnline(true);

      // Select first trip if none currently selected
      if (sorted.length > 0 && !selectedTrip) {
        setSelectedTrip(sorted[0]);
      }
    } catch {
      setApiError("Unable to connect to the itinerary service. Please ensure the backend server is running.");
      setBackendOnline(false);
    } finally {
      setLoadingTrips(false);
    }
  }, [selectedTrip]);

  useEffect(() => {
    checkBackendHealth();
    fetchTrips();
  }, [checkBackendHealth, fetchTrips]);

  // Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        destination: formData.destination.trim(),
        country: formData.country.trim(),
        days: Number(formData.days),
        budget: Number(formData.budget),
        currency: formData.currency,
        travel_style: formData.travel_style,
        travel_month: formData.travel_month,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Failed to create itinerary (${res.status})`
        );
      }

      const createdTrip: Trip = await res.json();
      setSelectedTrip(createdTrip);
      setSuccessMessage(`Itinerary for ${createdTrip.destination} has been generated successfully!`);
      setBackendOnline(true);

      // Refresh list to include new item
      await fetchTrips();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating itinerary";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Parse structured AI recommendation JSON or fallback to raw markdown
  const parsedRecommendation = useMemo<StructuredAiRecommendation | null>(() => {
    if (!selectedTrip?.ai_recommendation) return null;
    try {
      const parsed = JSON.parse(selectedTrip.ai_recommendation);
      if (
        parsed &&
        typeof parsed === "object" &&
        (parsed.daily_itinerary || parsed.travel_tips || parsed.food_recommendations || parsed.budget_breakdown)
      ) {
        return parsed as StructuredAiRecommendation;
      }
    } catch {
      // not JSON or legacy string format
    }
    return null;
  }, [selectedTrip?.ai_recommendation]);

  const handleCopyAiRecommendation = () => {
    if (selectedTrip?.ai_recommendation) {
      if (parsedRecommendation) {
        // Create formatted readable text for clipboard
        const lines: string[] = [
          `🌍 Trip Itinerary: ${selectedTrip.destination}, ${selectedTrip.country}`,
          `⏱️ Duration: ${selectedTrip.days} Days | 💰 Budget: ${formatCurrency(selectedTrip.budget, selectedTrip.currency)}`,
          `✨ Style: ${selectedTrip.travel_style} | 📅 Month: ${selectedTrip.travel_month}`,
          "",
        ];

        if (parsedRecommendation.trip_overview) {
          lines.push(`Overview:\n${parsedRecommendation.trip_overview}\n`);
        }

        if (parsedRecommendation.daily_itinerary?.length) {
          lines.push("🗓️ DAILY ITINERARY:");
          parsedRecommendation.daily_itinerary.forEach((d) => {
            lines.push(`\n[Day ${d.day}: ${d.title}]`);
            lines.push(`• 🌅 Morning: ${d.morning}`);
            lines.push(`• ☀️ Afternoon: ${d.afternoon}`);
            lines.push(`• 🌙 Evening: ${d.evening}`);
            if (d.daily_tip) lines.push(`• 💡 Tip: ${d.daily_tip}`);
          });
          lines.push("");
        }

        if (parsedRecommendation.travel_tips?.length) {
          lines.push("💡 TRAVEL TIPS:");
          parsedRecommendation.travel_tips.forEach((t) => {
            lines.push(`• ${t.title}: ${t.tip}`);
          });
          lines.push("");
        }

        if (parsedRecommendation.food_recommendations?.length) {
          lines.push("🍜 LOCAL FOOD MUST-TRYS:");
          parsedRecommendation.food_recommendations.forEach((f) => {
            lines.push(`• ${f.dish} (${f.recommended_spot}): ${f.description}`);
          });
          lines.push("");
        }

        if (parsedRecommendation.budget_breakdown?.length) {
          lines.push("📊 ESTIMATED BUDGET BREAKDOWN:");
          parsedRecommendation.budget_breakdown.forEach((b) => {
            lines.push(`• ${b.category}: ${formatCurrency(b.estimated_amount, selectedTrip.currency)} (${b.percentage}%) - ${b.description}`);
          });
        }

        navigator.clipboard.writeText(lines.join("\n"));
      } else {
        navigator.clipboard.writeText(selectedTrip.ai_recommendation);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (preset: TripFormData) => {
    setFormData({
      destination: preset.destination,
      country: preset.country,
      days: preset.days,
      budget: preset.budget,
      currency: preset.currency,
      travel_style: preset.travel_style,
      travel_month: preset.travel_month,
    });
  };

  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.destination?.toLowerCase().includes(q) ||
      t.country?.toLowerCase().includes(q) ||
      t.travel_style?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
    );
  });

  const formatCurrency = (val: number, cur: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `${cur} ${val?.toLocaleString()}`;
    }
  };

  const getTipIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("transport") || t.includes("transit") || t.includes("navigation")) {
      return <Bus className="h-4 w-4 text-indigo-600 shrink-0" />;
    }
    if (t.includes("weather") || t.includes("season") || t.includes("pack")) {
      return <CloudSun className="h-4 w-4 text-amber-600 shrink-0" />;
    }
    if (t.includes("money") || t.includes("connect") || t.includes("sim") || t.includes("cash") || t.includes("card")) {
      return <CreditCard className="h-4 w-4 text-emerald-600 shrink-0" />;
    }
    return <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/90 via-purple-50/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/90 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  KelanaAI
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  AI Travel Architect
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Personalized travel planning powered by intelligent AI models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* System Status Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                backendOnline === true
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : backendOnline === false
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  backendOnline === true
                    ? "bg-emerald-500"
                    : backendOnline === false
                    ? "bg-rose-500"
                    : "bg-slate-400"
                }`}
              />
              <span>
                {backendOnline === true
                  ? "AI Service Online"
                  : backendOnline === false
                  ? "Service Offline"
                  : "Checking Status..."}
              </span>
            </div>

            <button
              onClick={fetchTrips}
              disabled={loadingTrips}
              title="Refresh Itineraries"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${loadingTrips ? "animate-spin text-indigo-600" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </header>

        {/* Global Alerts */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-rose-900">Service Alert</p>
              <p className="mt-0.5 text-rose-700">{apiError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-900">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Grid: Left Form & Right Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Trip Planner Form & Saved History */}
          <div className="lg:col-span-5 space-y-6">
            {/* Input Form Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Plan Your Journey</h2>
                    <p className="text-xs text-slate-500">Configure your dream vacation preferences</p>
                  </div>
                </div>
              </div>

              {/* Quick Destination Presets */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Featured Destinations
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_TRIPS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-left font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 border border-slate-200/80 rounded-xl transition-all group"
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <span className="truncate font-semibold">{preset.destination}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Destination & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Destination City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g. Tokyo"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Japan"
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Days & Month */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Duration (Days) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={90}
                        required
                        value={formData.days}
                        onChange={(e) =>
                          setFormData({ ...formData, days: Math.max(1, parseInt(e.target.value) || 1) })
                        }
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Travel Month <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.travel_month}
                      onChange={(e) => setFormData({ ...formData, travel_month: e.target.value })}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget & Currency */}
                <div className="grid grid-cols-3 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total Budget <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        required
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: Math.max(0, parseFloat(e.target.value) || 0) })
                        }
                        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Travel Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Travel Style</label>
                  <select
                    value={formData.travel_style}
                    onChange={(e) => setFormData({ ...formData, travel_style: e.target.value })}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-3 flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Crafting Your Custom Itinerary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>Generate Travel Itinerary</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Saved Itineraries History */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Saved Itineraries
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-3.5">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations or travel styles..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* List of Saved Trips */}
              {loadingTrips && trips.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <RotateCw className="h-5 w-5 animate-spin text-indigo-600" />
                  <span>Loading your travel plans...</span>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                  {searchQuery ? "No matching itineraries found" : "No saved trips yet. Generate your first itinerary above!"}
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                  {filteredTrips.map((trip) => {
                    const isSelected = selectedTrip?.id === trip.id;
                    return (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => setSelectedTrip(trip)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200/60 shadow-xs"
                            : "bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {trip.destination}, {trip.country}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                trip.category === "Luxury"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : trip.category === "Backpacker"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {trip.category || "Standard"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 mt-1.5 text-xs text-slate-500 font-medium">
                            <span>{trip.days} Days</span>
                            <span>•</span>
                            <span>{formatCurrency(trip.budget, trip.currency)}</span>
                            <span>•</span>
                            <span className="truncate">{trip.travel_month}</span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isSelected ? "text-indigo-600 translate-x-0.5" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Response / Itinerary Presentation */}
          <div className="lg:col-span-7 space-y-6">
            {selectedTrip ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                {/* Hero Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {selectedTrip.travel_style}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedTrip.category === "Luxury"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : selectedTrip.category === "Backpacker"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {selectedTrip.category} Class
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="h-7 w-7 text-indigo-600 shrink-0" />
                      <span>
                        {selectedTrip.destination}, {selectedTrip.country}
                      </span>
                    </h2>
                  </div>

                  <button
                    onClick={handleCopyAiRecommendation}
                    className="self-start flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-600" />
                        <span>Copy Itinerary</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Wallet className="h-4 w-4 text-indigo-600" />
                      <span>Total Budget</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900">
                      {formatCurrency(selectedTrip.budget, selectedTrip.currency)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span>Daily Budget</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-emerald-700">
                      {formatCurrency(selectedTrip.daily_budget, selectedTrip.currency)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Clock className="h-4 w-4 text-violet-600" />
                      <span>Duration</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900">
                      {selectedTrip.days} Days
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Sun className="h-4 w-4 text-amber-600" />
                      <span>Travel Season</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-amber-800">
                      {selectedTrip.travel_month}
                    </p>
                  </div>
                </div>

                {/* Structured Sections Navigation Filter */}
                {parsedRecommendation && (
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl mb-6">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "all"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        Full Overview
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("itinerary")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "itinerary"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Daily Itinerary
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("tips")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "tips"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Travel Tips
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("food")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "food"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Utensils className="h-3.5 w-3.5" />
                        Local Food
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("budget")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === "budget"
                          ? "bg-white text-indigo-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <PieChart className="h-3.5 w-3.5" />
                        Budget Breakdown
                      </span>
                    </button>
                  </div>
                )}

                {/* Trip Overview Intro Banner */}
                {parsedRecommendation?.trip_overview && (
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-sm leading-relaxed mb-6">
                    <p className="font-medium text-slate-700">
                      {parsedRecommendation.trip_overview}
                    </p>
                  </div>
                )}

                {/* RICH STRUCTURED SECTIONS */}
                {parsedRecommendation ? (
                  <div className="space-y-8">
                    {/* 1. DAILY ITINERARY SECTION */}
                    {(activeTab === "all" || activeTab === "itinerary") &&
                      parsedRecommendation.daily_itinerary &&
                      parsedRecommendation.daily_itinerary.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">
                              Daily Itinerary ({parsedRecommendation.daily_itinerary.length} Days)
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {parsedRecommendation.daily_itinerary.map((dayItem) => (
                              <div
                                key={dayItem.day}
                                className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all"
                              >
                                {/* Day Card Header */}
                                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80">
                                  <div className="flex items-center gap-2.5">
                                    <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs">
                                      Day {dayItem.day}
                                    </span>
                                    <h4 className="font-bold text-base text-slate-900">
                                      {dayItem.title}
                                    </h4>
                                  </div>
                                </div>

                                {/* Morning, Afternoon, Evening Activity Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                                  {/* Morning */}
                                  <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-2xs flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-2">
                                        <Sunrise className="h-4 w-4 text-amber-500" />
                                        <span>Morning</span>
                                      </div>
                                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                        {dayItem.morning}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Afternoon */}
                                  <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs mb-2">
                                        <Sun className="h-4 w-4 text-indigo-500" />
                                        <span>Afternoon</span>
                                      </div>
                                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                        {dayItem.afternoon}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Evening */}
                                  <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-2xs flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs mb-2">
                                        <Moon className="h-4 w-4 text-purple-500" />
                                        <span>Evening</span>
                                      </div>
                                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                        {dayItem.evening}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Day Tip Footer */}
                                {dayItem.daily_tip && (
                                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
                                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>
                                      <strong className="text-slate-800">Day {dayItem.day} Tip:</strong> {dayItem.daily_tip}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* 2. TRAVEL TIPS SECTION */}
                    {(activeTab === "all" || activeTab === "tips") &&
                      parsedRecommendation.travel_tips &&
                      parsedRecommendation.travel_tips.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                              <Lightbulb className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">
                              Essential Travel Tips
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {parsedRecommendation.travel_tips.map((tip, idx) => (
                              <div
                                key={idx}
                                className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-all"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {getTipIcon(tip.title)}
                                  <h4 className="font-bold text-sm text-slate-900">
                                    {tip.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                  {tip.tip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* 3. LOCAL FOOD RECOMMENDATIONS SECTION */}
                    {(activeTab === "all" || activeTab === "food") &&
                      parsedRecommendation.food_recommendations &&
                      parsedRecommendation.food_recommendations.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                              <Utensils className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">
                              Local Culinary Recommendations
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {parsedRecommendation.food_recommendations.map((food, idx) => (
                              <div
                                key={idx}
                                className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Utensils className="h-4 w-4 text-rose-500 shrink-0" />
                                    <h4 className="font-bold text-sm text-slate-900">
                                      {food.dish}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                    {food.description}
                                  </p>
                                </div>
                                <div className="pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                                  <span className="truncate">
                                    <strong className="text-slate-700">Where to try:</strong> {food.recommended_spot}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* 4. ESTIMATED BUDGET BREAKDOWN SECTION */}
                    {(activeTab === "all" || activeTab === "budget") &&
                      parsedRecommendation.budget_breakdown &&
                      parsedRecommendation.budget_breakdown.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                              <PieChart className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">
                              Estimated Budget Breakdown
                            </h3>
                          </div>

                          <div className="space-y-3">
                            {parsedRecommendation.budget_breakdown.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="font-bold text-sm text-slate-900">
                                    {item.category}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                      {formatCurrency(item.estimated_amount, selectedTrip.currency)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                      ({item.percentage}%)
                                    </span>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200/80 rounded-full h-2 mb-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                                  />
                                </div>

                                <p className="text-xs text-slate-500">
                                  {item.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  /* FALLBACK MARKDOWN VIEW FOR LEGACY RECORDS */
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      <h3 className="font-bold text-base text-slate-900">
                        Itinerary & Recommendation
                      </h3>
                    </div>

                    <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
                      {selectedTrip.ai_recommendation ? (
                        <div className="prose prose-slate max-w-none text-slate-800">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200 first:mt-0">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base sm:text-lg font-bold text-indigo-900 mt-5 mb-2.5 flex items-center gap-2 border-l-4 border-indigo-600 pl-3 first:mt-0">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2 first:mt-0">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="text-sm text-slate-700 leading-relaxed mb-3 last:mb-0">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 my-3 marker:text-indigo-600">
                                  {children}
                                </ul>
                              ),
                              li: ({ children }) => (
                                <li className="leading-relaxed pl-1">
                                  {children}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-slate-900 bg-indigo-50/80 px-1 py-0.5 rounded text-indigo-950">
                                  {children}
                                </strong>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-indigo-600 bg-indigo-50/60 px-4 py-3 my-3 rounded-r-2xl text-slate-700 text-sm italic">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {selectedTrip.ai_recommendation}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-slate-400 italic text-sm">
                          No recommendation content available for this trip.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer timestamp */}
                {selectedTrip.created_at && (
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Created: {new Date(selectedTrip.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <Award className="h-3.5 w-3.5 text-indigo-600" />
                      Verified AI Plan
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* EMPTY SELECTION STATE */
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] shadow-xs">
                <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Itinerary Selected</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                  Fill in your destination details on the left to generate a personalized itinerary, or select one of your saved trips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
