"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Wallet,
  TrendingUp,
  Clock,
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
  Calendar,
  FileText,
  Copy,
  Check,
  Navigation,
  Compass,
} from "lucide-react";
import { Trip, StructuredAiRecommendation } from "@/types/trip";
import { getDestinationPhoto, formatCurrency, parseRecommendation } from "@/lib/utils";

export interface TripDetailViewProps {
  trip: Trip | null;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function TripDetailView({
  trip,
  emptyTitle = "No Itinerary Selected",
  emptySubtitle = "Fill in your travel destination on the left to generate a personalized itinerary, or select from your saved trips.",
}: TripDetailViewProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "itinerary" | "tips" | "food" | "budget">("all");

  const parsedRecommendation = useMemo<StructuredAiRecommendation | null>(() => {
    return parseRecommendation(trip?.ai_recommendation);
  }, [trip?.ai_recommendation]);

  const handleCopyAiRecommendation = () => {
    if (!trip?.ai_recommendation) return;

    if (parsedRecommendation) {
      const lines: string[] = [
        `🌍 Trip Itinerary: ${trip.destination}, ${trip.country}`,
        `⏱️ Duration: ${trip.days} Days | 💰 Budget: ${formatCurrency(trip.budget, trip.currency)}`,
        `✨ Style: ${trip.travel_style} | 📅 Month: ${trip.travel_month}`,
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
          lines.push(
            `• ${b.category}: ${formatCurrency(b.estimated_amount, trip.currency)} (${b.percentage}%) - ${b.description}`
          );
        });
      }

      navigator.clipboard.writeText(lines.join("\n"));
    } else {
      navigator.clipboard.writeText(trip.ai_recommendation);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (!trip) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center justify-center min-h-[420px] shadow-xs">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
          <Compass className="h-8 w-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">{emptySubtitle}</p>
      </div>
    );
  }

  const destinationPhoto = getDestinationPhoto(trip.destination, trip.country);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
      {/* 1. DESTINATION HERO IMAGE HEADER */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
        <Image
          src={destinationPhoto}
          alt={`${trip.destination}, ${trip.country}`}
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
              {trip.travel_style || "Solo"}
            </span>
            {trip.trip_theme && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-orange-950 border border-white/50 shadow-sm">
                {trip.trip_theme}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
                trip.category === "Luxury"
                  ? "bg-amber-500/90 text-white"
                  : trip.category === "Backpacker"
                  ? "bg-emerald-600/90 text-white"
                  : "bg-blue-600/90 text-white"
              }`}
            >
              {trip.category || "Standard"} Class
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
            <span>{trip.destination}</span>
            <span className="text-slate-300 font-light">•</span>
            <span className="text-indigo-200">{trip.country}</span>
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-7 md:p-8 space-y-6">
        {/* 2. KEY METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Wallet className="h-4 w-4 text-indigo-600" />
              <span>Total Budget</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-slate-900 truncate">
              {formatCurrency(trip.budget, trip.currency)}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Daily Budget</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-emerald-700 truncate">
              {formatCurrency(trip.daily_budget, trip.currency)}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Clock className="h-4 w-4 text-violet-600" />
              <span>Duration</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-slate-900">
              {trip.days} Days
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
              <Sun className="h-4 w-4 text-amber-600" />
              <span>Season</span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-amber-800 truncate">
              {trip.travel_month}
            </p>
          </div>
        </div>

        {/* 3. SECTION TABS FILTER */}
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

                        {/* Activity Grid */}
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
                          <h4 className="font-bold text-sm text-slate-900">{tip.title}</h4>
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
                            <h4 className="font-bold text-sm text-slate-900">{food.dish}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {food.description}
                          </p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="truncate">
                            <strong className="text-slate-700">Where to try:</strong>{" "}
                            {food.recommended_spot}
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
                              {formatCurrency(item.estimated_amount, trip.currency)}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              ({item.percentage}%)
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-200/80 rounded-full h-2 mb-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                          />
                        </div>

                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          /* FALLBACK MARKDOWN VIEW */
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">Itinerary & Recommendation</h3>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              {trip.ai_recommendation ? (
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
                        <li className="leading-relaxed pl-1">{children}</li>
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
                    {trip.ai_recommendation}
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
        {trip.created_at && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>
              Created:{" "}
              {new Date(trip.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              Verified AI Plan
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetailView;
