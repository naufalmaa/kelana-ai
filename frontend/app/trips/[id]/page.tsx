"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCw, AlertCircle } from "lucide-react";
import { Trip } from "@/types/trip";
import { getTrip } from "@/services/tripService";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TripDetailView } from "@/components/TripDetailView";
import { formatCurrency, getDestinationFlag } from "@/lib/utils";

export default function TripDetailPage() {
  const routeParams = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract ID
  const tripId = routeParams?.id as string;

  useEffect(() => {
    if (!tripId) return;

    let isMounted = true;

    getTrip(tripId)
      .then((data) => {
        if (isMounted) {
          setTrip(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          // If offline and testing demo ID 1 or preview
          if (tripId === "1") {
            setTrip({
              id: 1,
              destination: "Tokyo",
              country: "Japan",
              days: 5,
              budget: 2000,
              currency: "USD",
              category: "Standard",
              daily_budget: 400,
              travel_style: "Solo",
              trip_theme: "Cultural & Culinary",
              travel_month: "April",
              ai_recommendation: JSON.stringify({
                trip_overview: "A 5-day cultural and modern exploration of Tokyo and surrounding historic sites in Japan.",
                daily_itinerary: [
                  {
                    day: 1,
                    title: "Historical Asakusa & Sumida River",
                    morning: "Visit Asakusa and Senso-ji Temple, stroll along Nakamise-dori shopping street.",
                    afternoon: "Walk to Tokyo Skytree for panoramic city views and Sumida park.",
                    evening: "Dinner around Asakusa trying authentic tempura and riverside walk.",
                    daily_tip: "Senso-ji is least crowded early in the morning before 9 AM.",
                  },
                  {
                    day: 2,
                    title: "Modern Shibuya & Harajuku Culture",
                    morning: "Explore Shibuya Crossing, Hachiko statue, and Shibuya Sky observatory.",
                    afternoon: "Walk through Yoyogi Park to Meiji Jingu Shrine and Takeshita Street.",
                    evening: "Experience vibrant dining in Omoide Yokocho or Shibuya dining alleys.",
                    daily_tip: "Get a Pasmo or Suica digital card for frictionless subway travel.",
                  },
                  {
                    day: 3,
                    title: "Traditional Architecture & Gardens",
                    morning: "Imperial Palace East Gardens and Chidorigafuchi moat walk.",
                    afternoon: "Explore Ginza district architecture, luxury boutiques, and art galleries.",
                    evening: "Kabuki-za theater exterior and sushi dinner in Tsukiji Outer Market.",
                  },
                  {
                    day: 4,
                    title: "Tech, Gaming & Pop Culture",
                    morning: "Akihabara electronics and anime district immersion.",
                    afternoon: "Visit Ueno Park museums (Tokyo National Museum).",
                    evening: "Ameyoko market street food and Izakaya experience.",
                  },
                  {
                    day: 5,
                    title: "Bayside Odaiba & Sunset Views",
                    morning: "TeamLab digital art exhibition at Toyosu.",
                    afternoon: "Odaiba Seaside Park, Rainbow Bridge views, and shopping malls.",
                    evening: "Farewell dinner overlooking Tokyo Bay skyline.",
                  },
                ],
                travel_tips: [
                  {
                    title: "Public Transit Navigation",
                    tip: "Download Tokyo Subway Navigation app and keep your Suica/Pasmo card ready on Apple Wallet or Google Wallet.",
                  },
                  {
                    title: "Spring Weather & Clothing",
                    tip: "April temperatures range from 10°C to 19°C. Pack light layers and comfortable walking shoes for 15,000+ daily steps.",
                  },
                ],
                food_recommendations: [
                  {
                    dish: "Authentic Edomae Sushi",
                    description: "Freshly sliced seasonal fish served over seasoned sushi rice.",
                    recommended_spot: "Tsukiji Outer Market, Chuo City",
                  },
                  {
                    dish: "Tonkotsu Ramen",
                    description: "Rich pork bone broth with firm noodles and tender chashu pork.",
                    recommended_spot: "Ichiran Shibuya or Afuri Harajuku",
                  },
                ],
                budget_breakdown: [
                  {
                    category: "Accommodation",
                    percentage: 40,
                    estimated_amount: 800,
                    description: "Clean modern mid-scale hotel in Shinjuku or Asakusa.",
                  },
                  {
                    category: "Food & Dining",
                    percentage: 30,
                    estimated_amount: 600,
                    description: "Daily mix of casual ramen shops, conveyor sushi, and cafes.",
                  },
                  {
                    category: "Activities & Sightseeing",
                    percentage: 15,
                    estimated_amount: 300,
                    description: "Entry tickets to Tokyo Skytree, museums, and TeamLab.",
                  },
                  {
                    category: "Transportation & Local Transit",
                    percentage: 15,
                    estimated_amount: 300,
                    description: "Unlimited Tokyo subway passes and airport express transit.",
                  },
                ],
              }),
              created_at: new Date().toISOString(),
            });
          } else {
            setError(err instanceof Error ? err.message : `Failed to load trip #${tripId}`);
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Navigation Breadcrumb matching Part 5 slide */}
        <div className="mb-6">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Trips</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <RotateCw className="h-7 w-7 text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading trip itinerary #{tripId}...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-black text-rose-900">Trip Not Found</h2>
            <p className="text-xs text-rose-700 mt-1 mb-6">{error}</p>
            {error.toLowerCase().includes("credentials") || !isAuthenticated ? (
              <button
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Sign In to Access Itinerary</span>
              </button>
            ) : (
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Trip History
              </Link>
            )}
          </div>
        ) : trip ? (
          <div className="space-y-6">
            {/* Quick summary stats bar matching Part 5 layout */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    Trip #{trip.id}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>{getDestinationFlag(trip.destination, trip.country)}</span>
                    <span>{trip.destination}, {trip.country}</span>
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {trip.travel_style || "Solo"}
                  </span>
                  {trip.trip_theme && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                      {trip.trip_theme}
                    </span>
                  )}
                </div>
              </div>

              {/* 4 Metadata Cards from Part 5 Slide */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Destination
                  </span>
                  <p className="font-black text-sm text-slate-900 truncate">
                    {trip.destination}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Budget
                  </span>
                  <p className="font-black text-sm text-emerald-700 truncate">
                    {formatCurrency(trip.budget, trip.currency)}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Category
                  </span>
                  <p className="font-black text-sm text-indigo-700 truncate">
                    {trip.category || "Standard"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Days
                  </span>
                  <p className="font-black text-sm text-slate-900 truncate">
                    {trip.days} Days
                  </p>
                </div>
              </div>
            </div>

            {/* Rich Detailed Display */}
            <TripDetailView trip={trip} />
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
