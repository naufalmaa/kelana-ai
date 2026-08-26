"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  DollarSign,
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
} from "lucide-react";
import { Trip, TripFormData, PresetDestination } from "@/types/trip";
import { PRESET_TRIPS, DEFAULT_HERO_IMAGE, CURRENCIES, MONTHS, STYLES } from "@/lib/constants";
import { getTrips, generateTrip, checkBackendHealth } from "@/services/tripService";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TripCard } from "@/components/TripCard";
import { TripDetailView } from "@/components/TripDetailView";

export default function Home() {
  const router = useRouter();
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
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);


  // Fetch all trips (for manual refresh & after submit)
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setApiError(null);
    try {
      const data = await getTrips();
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
    let isMounted = true;

    checkBackendHealth().then((online) => {
      if (isMounted) setBackendOnline(online);
    });

    getTrips()
      .then((data) => {
        if (!isMounted) return;
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          : [];
        setTrips(sorted);
        setBackendOnline(true);
        if (sorted.length > 0 && !selectedTrip) {
          setSelectedTrip(sorted[0]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiError("Unable to connect to the itinerary service. Please ensure the backend server is running.");
          setBackendOnline(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingTrips(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTrip]);

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

      const createdTrip = await generateTrip(payload);
      setSelectedTrip(createdTrip);
      setSuccessMessage(`Itinerary for ${createdTrip.destination} has been generated successfully!`);
      setBackendOnline(true);

      // Part 8: After generating a trip, automatically redirect to dashboard
      router.push("/trips");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating itinerary";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const applyPreset = (preset: PresetDestination) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* 1. TOP STICKY NAVBAR */}
      <Navbar
        backendOnline={backendOnline}
        onRefresh={fetchTrips}
        loading={loadingTrips}
      />

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
                Design Your Dream Journey with{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-200 bg-clip-text text-transparent">
                  Intelligent AI
                </span>
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
                      className="group relative overflow-hidden rounded-2xl border border-white/15 h-24 sm:h-28 text-left transition-all hover:scale-[1.02] hover:border-white/40 active:scale-95 shadow-md cursor-pointer"
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
                {/* Destination & Country */}
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

            {/* Saved Itineraries Card using reusable TripCard */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Saved Itineraries</h2>
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
                  {searchQuery
                    ? "No matching itineraries found"
                    : "No saved trips yet. Generate your first itinerary above!"}
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                  {filteredTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isSelected={selectedTrip?.id === trip.id}
                      onSelect={(t) => setSelectedTrip(t)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Output Presentation */}
          <div id="itinerary-output" className="lg:col-span-7 space-y-6 w-full">
            <TripDetailView trip={selectedTrip} />
          </div>
        </div>
      </main>

      {/* 4. PROFESSIONAL REAL-PRODUCT FOOTER */}
      <Footer />
    </div>
  );
}
