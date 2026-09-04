"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Coins,
  Sparkles,
  Plane,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Search,
  Globe,
  Bookmark,
  ArrowRight,
  Camera,
  Lock,
} from "lucide-react";
import { Trip, TripFormData, PresetDestination } from "@/types/trip";
import { PRESET_TRIPS, CURRENCIES, MONTHS, TRAVEL_STYLES, TRIP_THEMES } from "@/lib/constants";
import { getTrips, generateTrip, checkBackendHealth } from "@/services/tripService";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TripCard } from "@/components/TripCard";
import { TripDetailView } from "@/components/TripDetailView";
import { getDestinationPhoto, formatCurrency } from "@/lib/utils";

const DEFAULT_PREVIEW_TRIP: Trip = {
  id: 0,
  destination: "Interlaken",
  country: "Switzerland",
  days: 8,
  budget: 4500,
  currency: "USD",
  category: "Luxury",
  daily_budget: 563,
  travel_style: "Couple",
  trip_theme: "Adventure & Outdoors",
  travel_month: "July",
  ai_recommendation: JSON.stringify({
    trip_overview: "Embark on an exhilarating 8-day adventure in Interlaken, Switzerland this July, where the majestic Swiss Alps provide the perfect backdrop for an unforgettable outdoor experience. Explore crystal-clear lakes, conquer challenging hiking trails, and immerse yourself in the natural beauty and vibrant culture of this enchanting region.",
    daily_itinerary: [
      {
        day: 1,
        title: "Arrival in Interlaken & Lake Brienz Cruise",
        morning: "Arrive in Interlaken and settle into your alpine chalet or boutique hotel.",
        afternoon: "Take a scenic boat cruise on turquoise Lake Brienz admiring towering waterfalls.",
        evening: "Enjoy traditional Swiss fondue and raclette at a cozy tavern in Höhematte.",
        daily_tip: "Purchase the Swiss Travel Pass for seamless boat and train connections."
      },
      {
        day: 2,
        title: "Jungfraujoch — Top of Europe",
        morning: "Board the Eiger Express tri-cable gondola to Jungfraujoch high altitude station.",
        afternoon: "Explore the Ice Palace and take in 360-degree views of the Aletsch Glacier.",
        evening: "Warm up with artisan Swiss hot chocolate in Grindelwald village.",
        daily_tip: "Dress in warm layers as temperatures at the summit remain freezing year-round."
      }
    ],
    travel_tips: [
      { title: "Transport & Trains", tip: "Use regional rail passes for limitless train, bus, and boat journeys." },
      { title: "Alpine Packing", tip: "Bring sturdy hiking boots, sunscreen, and moisture-wicking layers." }
    ],
    food_recommendations: [
      { dish: "Cheese Fondue", description: "Melted Gruyère and Emmental served with crusty bread cubes.", recommended_spot: "Traditional alpine taverns" },
      { dish: "Rösti & Zürcher Geschnetzeltes", description: "Crispy shredded potato pancake with creamy sliced veal.", recommended_spot: "Local mountain restaurants" }
    ],
    budget_breakdown: [
      { category: "Accommodation", percentage: 40, estimated_amount: 1800, description: "Boutique alpine hotels & lodges" },
      { category: "Food & Dining", percentage: 25, estimated_amount: 1125, description: "Swiss alpine dining & local meals" },
      { category: "Excursions & Cable Cars", percentage: 25, estimated_amount: 1125, description: "Jungfraujoch & adventure passes" },
      { category: "Transit & Reserves", percentage: 10, estimated_amount: 450, description: "Regional transit and souvenirs" }
    ]
  })
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, openAuthModal } = useAuth();

  const [formData, setFormData] = useState<TripFormData>({
    destination: "Tokyo",
    country: "Japan",
    days: 5,
    budget: 2000,
    currency: "USD",
    travel_style: "Solo",
    trip_theme: "Cultural & Culinary",
    travel_month: "April",
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(DEFAULT_PREVIEW_TRIP);
  const [loadingTrips, setLoadingTrips] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Fetch all trips for authenticated user
  const fetchTrips = useCallback(async () => {
    if (!isAuthenticated) {
      setTrips([]);
      return;
    }

    setLoadingTrips(true);
    setApiError(null);
    try {
      const data = await getTrips();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        : [];
      setTrips(sorted);
      setBackendOnline(true);

      if (sorted.length > 0) {
        setSelectedTrip(sorted[0]);
      }
    } catch {
      setApiError("Unable to connect to the itinerary service. Please ensure the backend server is running.");
      setBackendOnline(false);
    } finally {
      setLoadingTrips(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    checkBackendHealth().then((online) => {
      if (isMounted) setBackendOnline(online);
    });

    if (isAuthenticated) {
      getTrips()
        .then((data) => {
          if (!isMounted) return;
          const sorted = Array.isArray(data)
            ? [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
            : [];
          setTrips(sorted);
          setBackendOnline(true);
          if (sorted.length > 0) {
            setSelectedTrip(sorted[0]);
          }
        })
        .catch(() => {
          if (isMounted) {
            setBackendOnline(false);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingTrips(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Smooth scroll to planner form if hash is #planner
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#planner") {
      const el = document.getElementById("planner");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    }
  }, []);

  // Execute Trip Generation
  const executeTripGeneration = async () => {
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
        trip_theme: formData.trip_theme,
        travel_month: formData.travel_month,
      };

      const createdTrip = await generateTrip(payload);
      setSelectedTrip(createdTrip);
      setSuccessMessage(`Itinerary for ${createdTrip.destination} has been generated successfully!`);
      setBackendOnline(true);

      // Part 8: Redirect user straight to /trips/[id]
      if (createdTrip && createdTrip.id) {
        router.push(`/trips/${createdTrip.id}`);
      } else {
        router.push("/trips");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating itinerary";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Form Submit with Auth Guard
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user is not authenticated, show Auth Modal first!
    if (!isAuthenticated) {
      openAuthModal("login", () => {
        // Callback automatically executed after successful login
        executeTripGeneration();
      });
      return;
    }

    await executeTripGeneration();
  };

  const applyPreset = (preset: PresetDestination) => {
    setFormData({
      destination: preset.destination,
      country: preset.country,
      days: preset.days,
      budget: preset.budget,
      currency: preset.currency,
      travel_style: preset.travel_style,
      trip_theme: preset.trip_theme || "Cultural & Culinary",
      travel_month: preset.travel_month,
    });
  };

  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.destination?.toLowerCase().includes(q) ||
      t.country?.toLowerCase().includes(q) ||
      t.travel_style?.toLowerCase().includes(q) ||
      t.trip_theme?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* 1. TOP STICKY NAVBAR */}
      <Navbar
        backendOnline={backendOnline}
        onRefresh={isAuthenticated ? fetchTrips : undefined}
        loading={loadingTrips}
      />

      {/* 2. HERO / SHOWCASE SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-14 sm:py-20 lg:py-24">
        {/* Subtle background ambient blur */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Next-Gen AI Travel Architect</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Design Your Perfect Journey in Seconds.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal max-w-2xl mx-auto">
              Enter your dream destination, budget, and travel party style. KelanaAI generates day-by-day itineraries, smart expense breakdowns, and local culinary gems.
            </p>
          </div>

          {/* Quick Preset Destination Cards Carousel / Grid */}
          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-indigo-400" />
                <span className="text-xs sm:text-sm font-bold text-indigo-200">
                  Popular Travel Presets
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click any destination to prefill form
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESET_TRIPS.map((preset) => (
                <button
                  key={preset.destination}
                  onClick={() => applyPreset(preset)}
                  className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-white/10 text-left transition-all duration-300 hover:scale-[1.02] hover:border-indigo-400 shadow-lg cursor-pointer"
                >
                  <Image
                    src={getDestinationPhoto(preset.destination, preset.country)}
                    alt={preset.destination}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {preset.days} Days
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold text-indigo-300">{preset.country}</p>
                    <p className="text-base sm:text-lg font-black tracking-tight flex items-center justify-between">
                      <span>{preset.destination}</span>
                      <span className="text-xs font-bold text-slate-200">
                        {formatCurrency(preset.budget, preset.currency)}
                      </span>
                    </p>
                    <p className="text-[10px] text-indigo-200/90 mt-0.5 truncate">
                      {preset.travel_style} · {preset.trip_theme}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE / INTERACTIVE PLANNER */}
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
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
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
            <div id="planner" className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs scroll-mt-24">
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
                {/* Destination & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Destination <span className="text-rose-500">*</span>
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

                {/* Days & Month */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Duration (Days) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Travel Month</label>
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
                      <Coins className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        min="50"
                        step="50"
                        required
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
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

                {/* Travel Style (Party) & Trip Theme (Activity Focus) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Travel Style</span>
                      <span className="text-[10px] font-semibold text-slate-400">Companion</span>
                    </label>
                    <select
                      value={formData.travel_style}
                      onChange={(e) => setFormData({ ...formData, travel_style: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                    >
                      {TRAVEL_STYLES.map((s) => (
                        <option key={s} value={s}>
                          {s === "Solo" ? "👤 Solo" : s === "Couple" ? "❤️ Couple" : "👨‍👩‍👧‍👦 Family"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Trip Theme</span>
                      <span className="text-[10px] font-semibold text-slate-400">Activity Focus</span>
                    </label>
                    <select
                      value={formData.trip_theme}
                      onChange={(e) => setFormData({ ...formData, trip_theme: e.target.value })}
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                    >
                      {TRIP_THEMES.map((theme) => (
                        <option key={theme} value={theme}>
                          {theme === "Cultural & Culinary"
                            ? "🍜 Cultural & Culinary"
                            : theme === "Relaxed & Nature"
                            ? "🌴 Relaxed & Nature"
                            : theme === "Adventure & Outdoors"
                            ? "🧭 Adventure & Outdoors"
                            : "✨ Luxury & Sightseeing"}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  ) : !isHydrated ? (
                    <>
                      <Sparkles className="h-5 w-5 text-amber-300" />
                      <span>Plan Your Itinerary</span>
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <Lock className="h-5 w-5 text-indigo-200" />
                      <span>Sign In to Generate Travel Itinerary</span>
                      <ArrowRight className="h-5 w-5 ml-1" />
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

            {/* Saved Itineraries Card using reusable TripCard */}
            {isHydrated && isAuthenticated ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">Your Saved Itineraries</h2>
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
                    placeholder="Filter your saved trips..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* List of Trip Cards */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {loadingTrips ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <RotateCw className="h-5 w-5 animate-spin mx-auto text-indigo-500" />
                      <p className="text-xs font-semibold">Loading itineraries...</p>
                    </div>
                  ) : filteredTrips.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-slate-600">No saved trips found.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Generate your first trip to save it to your account.
                      </p>
                    </div>
                  ) : (
                    filteredTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        isSelected={selectedTrip?.id === trip.id}
                        onSelect={(t) => setSelectedTrip(t)}
                        variant="compact"
                      />
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT COLUMN: Rich Itinerary Output Display */}
          <div className="lg:col-span-7 w-full">
            {selectedTrip ? (
              <TripDetailView trip={selectedTrip} />
            ) : (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
                <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                  Ready to Plan Your Next Adventure?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Fill out the form on the left or select a popular preset to explore a rich, AI-tailored travel plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}
