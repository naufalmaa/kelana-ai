"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
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
  Heart,
  Share2,
  ExternalLink,
  ChevronDown,
  Navigation,
  Camera,
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

interface PresetDestination extends TripFormData {
  label: string;
  icon: string;
  image: string;
  tagline: string;
}

const PRESET_TRIPS: PresetDestination[] = [
  {
    label: "Tokyo, Japan",
    icon: "🌸",
    destination: "Tokyo",
    country: "Japan",
    days: 7,
    budget: 2500,
    currency: "USD",
    travel_style: "Cultural & Culinary",
    travel_month: "April",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop",
    tagline: "Cherry blossoms, neon streets & Michelin dining",
  },
  {
    label: "Bali, Indonesia",
    icon: "🏝️",
    destination: "Bali",
    country: "Indonesia",
    days: 5,
    budget: 8000000,
    currency: "IDR",
    travel_style: "Relaxed & Nature",
    travel_month: "August",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    tagline: "Tropical beaches, lush rice terraces & sacred temples",
  },
  {
    label: "Paris, France",
    icon: "🗼",
    destination: "Paris",
    country: "France",
    days: 6,
    budget: 3200,
    currency: "EUR",
    travel_style: "Luxury & Sightseeing",
    travel_month: "October",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    tagline: "Art galleries, haute couture & Seine cruises",
  },
  {
    label: "Interlaken, Switzerland",
    icon: "🏔️",
    destination: "Interlaken",
    country: "Switzerland",
    days: 8,
    budget: 4500,
    currency: "USD",
    travel_style: "Adventure & Outdoors",
    travel_month: "July",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop",
    tagline: "Alpine vistas, turquoise lakes & mountain peaks",
  },
];

// High quality curated destination image map with universal fallback
const DESTINATION_IMAGES: Record<string, string> = {
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
  indonesia: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200&auto=format&fit=crop",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
  interlaken: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
  italy: "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=1200&auto=format&fit=crop",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200&auto=format&fit=crop",
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
  seoul: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=1200&auto=format&fit=crop",
  korea: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=1200&auto=format&fit=crop",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop",
};

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop";

function getDestinationPhoto(destination?: string, country?: string): string {
  if (!destination && !country) return DEFAULT_HERO_IMAGE;
  const dKey = (destination || "").toLowerCase().trim();
  const cKey = (country || "").toLowerCase().trim();

  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (dKey.includes(key) || key.includes(dKey) || cKey.includes(key) || key.includes(cKey)) {
      return url;
    }
  }
  return DEFAULT_HERO_IMAGE;
}

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

      // Scroll smoothly to output on mobile
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const outputEl = document.getElementById("itinerary-output");
        if (outputEl) {
          outputEl.scrollIntoView({ behavior: "smooth" });
        }
      }

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

  const currentDestinationPhoto = getDestinationPhoto(
    selectedTrip?.destination || formData.destination,
    selectedTrip?.country || formData.country
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* 1. TOP STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  KelanaAI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  Travel Planner
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500">
                AI-Powered Personalized Itinerary & Travel Architect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* System Status Indicator */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border ${
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
              <span className="text-[11px] sm:text-xs">
                {backendOnline === true
                  ? "AI Service Online"
                  : backendOnline === false
                  ? "Offline"
                  : "Checking..."}
              </span>
            </div>

            <button
              onClick={fetchTrips}
              disabled={loadingTrips}
              title="Refresh Itineraries"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${loadingTrips ? "animate-spin text-indigo-600" : ""}`} />
              <span className="hidden sm:inline">Sync Trips</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH DESTINATION IMAGE */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={DEFAULT_HERO_IMAGE}
            alt="Travel inspiration scenery"
            fill
            priority
            className="object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-indigo-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Next-Gen Travel Engine • Powered by AWS Bedrock</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Design Your Dream Journey with <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">Intelligent AI</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Craft tailored day-by-day itineraries, authentic culinary recommendations, and precision budget breakdowns custom-fit to your travel style.
              </p>

              {/* Quick stats pills */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Personalized Day Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span>Authentic Food Spots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Smart Budget Visualizer</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Featured Destination Cards */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-amber-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Popular Destinations
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-200">Click to autofill</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {PRESET_TRIPS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="group relative overflow-hidden rounded-2xl border border-white/15 h-24 sm:h-28 text-left transition-all hover:scale-[1.02] hover:border-white/40 active:scale-95 shadow-md"
                    >
                      <Image
                        src={preset.image}
                        alt={preset.label}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2">
                        <p className="text-xs sm:text-sm font-black text-white flex items-center gap-1 drop-shadow-sm truncate">
                          <span>{preset.icon}</span>
                          <span className="truncate">{preset.destination}</span>
                        </p>
                        <p className="text-[10px] text-slate-300 font-medium truncate">
                          {preset.country} • {preset.days}d
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Global Notifications */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-rose-900">Service Alert</p>
              <p className="mt-0.5 text-rose-700">{apiError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-bold text-emerald-900">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input Form & Saved Itineraries (Mobile Full Width, Desktop 5 Cols) */}
          <div className="lg:col-span-5 space-y-6 w-full">
            {/* Form Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">Plan Your Journey</h2>
                  <p className="text-xs text-slate-500">Configure your dream travel preferences</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Destination & Country (Responsive Stack on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Destination City <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g. Tokyo"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Japan"
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Days & Month (Responsive Stack on mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Duration (Days) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        max={90}
                        required
                        value={formData.days}
                        onChange={(e) =>
                          setFormData({ ...formData, days: Math.max(1, parseInt(e.target.value) || 1) })
                        }
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Travel Month <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.travel_month}
                      onChange={(e) => setFormData({ ...formData, travel_month: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Total Budget <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min={1}
                        required
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: Math.max(0, parseFloat(e.target.value) || 0) })
                        }
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Travel Style</label>
                  <select
                    value={formData.travel_style}
                    onChange={(e) => setFormData({ ...formData, travel_style: e.target.value })}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RotateCw className="h-5 w-5 animate-spin" />
                      <span>Generating AI Itinerary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-amber-300" />
                      <span>Generate Travel Itinerary</span>
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Saved Itineraries Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
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
                    const tripImg = getDestinationPhoto(trip.destination, trip.country);
                    return (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => setSelectedTrip(trip)}
                        className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center gap-3 group ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/60 shadow-xs"
                            : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {/* Thumbnail image */}
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                          <Image
                            src={tripImg}
                            alt={trip.destination}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {trip.destination}, {trip.country}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium truncate">
                            <span>{trip.days} Days</span>
                            <span>•</span>
                            <span>{formatCurrency(trip.budget, trip.currency)}</span>
                            <span>•</span>
                            <span className="truncate">{trip.travel_month}</span>
                          </div>
                        </div>

                        <ChevronRight
                          className={`h-4 w-4 transition-transform shrink-0 ${
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

          {/* RIGHT COLUMN: Output Presentation (Mobile Full Width, Desktop 7 Cols) */}
          <div id="itinerary-output" className="lg:col-span-7 space-y-6 w-full">
            {selectedTrip ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                {/* 1. DESTINATION HERO IMAGE HEADER */}
                <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
                  <Image
                    src={currentDestinationPhoto}
                    alt={`${selectedTrip.destination}, ${selectedTrip.country}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover brightness-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Badges on Top of Photo */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-indigo-900 border border-white/50 shadow-sm">
                        {selectedTrip.travel_style}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
                          selectedTrip.category === "Luxury"
                            ? "bg-amber-500/90 text-white"
                            : selectedTrip.category === "Backpacker"
                            ? "bg-emerald-600/90 text-white"
                            : "bg-blue-600/90 text-white"
                        }`}
                      >
                        {selectedTrip.category} Class
                      </span>
                    </div>

                    <button
                      onClick={handleCopyAiRecommendation}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-700" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Destination Title on Hero Bottom */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 text-white">
                    <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Navigation className="h-3.5 w-3.5 text-indigo-300" />
                      Trip Itinerary Plan
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md flex items-center gap-2">
                      <span>{selectedTrip.destination}</span>
                      <span className="text-slate-300 font-light">•</span>
                      <span className="text-indigo-200">{selectedTrip.country}</span>
                    </h2>
                  </div>
                </div>

                <div className="p-5 sm:p-7 md:p-8 space-y-6">
                  {/* 2. KEY METRICS GRID (Responsive 2x2 on mobile, 4 columns on tablet/desktop) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                        <Wallet className="h-4 w-4 text-indigo-600" />
                        <span>Total Budget</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-black text-slate-900 truncate">
                        {formatCurrency(selectedTrip.budget, selectedTrip.currency)}
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span>Daily Budget</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-black text-emerald-700 truncate">
                        {formatCurrency(selectedTrip.daily_budget, selectedTrip.currency)}
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                        <Clock className="h-4 w-4 text-violet-600" />
                        <span>Duration</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-black text-slate-900">
                        {selectedTrip.days} Days
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                        <Sun className="h-4 w-4 text-amber-600" />
                        <span>Season</span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg font-black text-amber-800 truncate">
                        {selectedTrip.travel_month}
                      </p>
                    </div>
                  </div>

                  {/* 3. SECTION TABS FILTER (Horizontal scroll on mobile) */}
                  {parsedRecommendation && (
                    <div className="overflow-x-auto pb-1 custom-scrollbar">
                      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl w-max sm:w-full">
                        <button
                          onClick={() => setActiveTab("all")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                    </div>
                  )}

                  {/* Trip Overview Banner */}
                  {parsedRecommendation?.trip_overview && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-slate-800 text-sm leading-relaxed">
                      <p className="font-medium text-slate-700">
                        {parsedRecommendation.trip_overview}
                      </p>
                    </div>
                  )}

                  {/* 4. FOUR RICH VISUAL SECTIONS */}
                  {parsedRecommendation ? (
                    <div className="space-y-8">
                      {/* SECTION 1: DAILY ITINERARY CARDS */}
                      {(activeTab === "all" || activeTab === "itinerary") &&
                        parsedRecommendation.daily_itinerary &&
                        parsedRecommendation.daily_itinerary.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                                Daily Itinerary ({parsedRecommendation.daily_itinerary.length} Days)
                              </h3>
                            </div>

                            <div className="space-y-4">
                              {parsedRecommendation.daily_itinerary.map((dayItem) => (
                                <div
                                  key={dayItem.day}
                                  className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-all"
                                >
                                  {/* Day Card Header */}
                                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80">
                                    <div className="flex items-center gap-2.5">
                                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs shrink-0">
                                        Day {dayItem.day}
                                      </span>
                                      <h4 className="font-bold text-sm sm:text-base text-slate-900">
                                        {dayItem.title}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Activity Grid (Responsive 1 col mobile -> 3 col tablet/desktop) */}
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

                      {/* SECTION 2: TRAVEL TIPS */}
                      {(activeTab === "all" || activeTab === "tips") &&
                        parsedRecommendation.travel_tips &&
                        parsedRecommendation.travel_tips.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                                <Lightbulb className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                                Essential Travel Tips
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {parsedRecommendation.travel_tips.map((tip, idx) => (
                                <div
                                  key={idx}
                                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-all"
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

                      {/* SECTION 3: LOCAL FOOD RECOMMENDATIONS */}
                      {(activeTab === "all" || activeTab === "food") &&
                        parsedRecommendation.food_recommendations &&
                        parsedRecommendation.food_recommendations.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                                <Utensils className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                                Local Culinary Recommendations
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {parsedRecommendation.food_recommendations.map((food, idx) => (
                                <div
                                  key={idx}
                                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
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

                      {/* SECTION 4: ESTIMATED BUDGET BREAKDOWN */}
                      {(activeTab === "all" || activeTab === "budget") &&
                        parsedRecommendation.budget_breakdown &&
                        parsedRecommendation.budget_breakdown.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                <PieChart className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-base sm:text-lg text-slate-900">
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

                      <div className="p-5 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
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

                  {/* Card Footer */}
                  {selectedTrip.created_at && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Created: {new Date(selectedTrip.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Award className="h-3.5 w-3.5 text-indigo-600" />
                        Verified AI Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* EMPTY SELECTION STATE */
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center justify-center min-h-[420px] shadow-xs">
                <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">No Itinerary Selected</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                  Fill in your travel destination on the left to generate a personalized itinerary, or select from your saved trips.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. PROFESSIONAL REAL-PRODUCT FOOTER */}
      <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  KelanaAI
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Your autonomous AI travel architect. Plan smart, explore deeper, and experience authentic global destinations with effortless precision.
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold text-indigo-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80">
                  <Sparkles className="h-3 w-3" />
                  AWS Bedrock Enhanced
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  <CheckCircle2 className="h-3 w-3" />
                  Real-time Planning
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Explore Destinations
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Tokyo & Japan Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bali Island Escapes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Paris & European Getaways</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Swiss Alps Adventures</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Southeast Asia Highlights</a></li>
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Planner Features
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Daily Itinerary Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Budget Breakdown</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Local Culinary Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seasonal Packing & Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Saved Travel History</a></li>
              </ul>
            </div>

            {/* Resources & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Company & Legal
              </h4>
              <ul className="space-y-2 text-xs font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About KelanaAI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Safety Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} KelanaAI. All rights reserved. Crafted for world travelers.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
              <a href="#" className="hover:text-slate-300 transition-colors flex items-center gap-1">
                <span>System Status</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
