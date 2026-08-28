"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  RotateCw,
  Bookmark,
  ArrowRight,
  AlertCircle,
  Plane,
  ArrowUpDown,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Trip } from "@/types/trip";
import { getTrips, checkBackendHealth } from "@/services/tripService";
import { TripCard } from "@/components/TripCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export type SortMode = "latest" | "oldest" | "highest_budget" | "lowest_budget";

const ITEMS_PER_PAGE = 6;

export default function TripsHistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const isOnline = await checkBackendHealth();
      setBackendOnline(isOnline);

      const data = await getTrips();
      setTrips(Array.isArray(data) ? data : []);
      setBackendOnline(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load saved itineraries. Please check if the backend is running."
      );
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    checkBackendHealth().then((online) => {
      if (isMounted) setBackendOnline(online);
    });

    getTrips()
      .then((data) => {
        if (!isMounted) return;
        setTrips(Array.isArray(data) ? data : []);
        setBackendOnline(true);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load saved itineraries. Please check if the backend is running."
        );
        setBackendOnline(false);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort trips based on Search & Sort criteria (Challenge slide)
  const processedTrips = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Search by Destination, Country, Travel Style (Companion), Theme, or Category
    const filtered = trips.filter((t) => {
      if (!q) return true;
      const destinationMatch =
        t.destination?.toLowerCase().includes(q) ||
        t.country?.toLowerCase().includes(q);
      const styleMatch = t.travel_style?.toLowerCase().includes(q);
      const themeMatch = t.trip_theme?.toLowerCase().includes(q);
      const categoryMatch = t.category?.toLowerCase().includes(q);
      return destinationMatch || styleMatch || themeMatch || categoryMatch;
    });

    // 2. Sort by selected criteria (Challenge bonus)
    return [...filtered].sort((a, b) => {
      switch (sortMode) {
        case "oldest":
          return (a.id ?? 0) - (b.id ?? 0);
        case "highest_budget":
          return (b.budget ?? 0) - (a.budget ?? 0);
        case "lowest_budget":
          return (a.budget ?? 0) - (b.budget ?? 0);
        case "latest":
        default:
          return (b.id ?? 0) - (a.id ?? 0);
      }
    });
  }, [trips, searchQuery, sortMode]);

  // Pagination calculation (Bonus Feature)
  const totalPages = Math.max(1, Math.ceil(processedTrips.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTrips = processedTrips.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of list
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar
        backendOnline={backendOnline}
        onRefresh={refreshData}
        loading={loading}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="h-5 w-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Saved Travel Plans
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Trip History
              </h1>
              {!loading && (
                <span className="text-sm sm:text-base font-bold text-slate-500">
                  {processedTrips.length}{" "}
                  {processedTrips.length === 1 ? "trip" : "trips"}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Browse, search, and revisit all personalized travel itineraries generated by KelanaAI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#planner"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-rose-900">Service Notice</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Controls Bar: Search & Sort Functionality (Challenge slide) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Core Challenge: Search by destination or travel style */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search trips by destination or style..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Bonus: Sort Trips Dropdown & View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortMode}
                onChange={(e) => {
                  setSortMode(e.target.value as SortMode);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs cursor-pointer"
              >
                <option value="latest">Latest (newest first)</option>
                <option value="oldest">Oldest (first trip first)</option>
                <option value="highest_budget">Highest Budget (descending)</option>
                <option value="lowest_budget">Lowest Budget (ascending)</option>
              </select>
            </div>

            {/* View Mode Toggle: Cards vs List */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "compact"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <RotateCw className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading your travel history...</p>
          </div>
        ) : trips.length === 0 ? (
          /* Part 7: Empty State (Helpful — Guides User) */
          <div className="space-y-4">
            <div className="rounded-3xl border border-emerald-600/30 bg-gradient-to-br from-[#23816e] to-[#1c695a] text-white p-12 sm:p-16 text-center flex flex-col items-center justify-center shadow-lg">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-5 text-white shadow-inner">
                <Plane className="h-8 w-8 text-white -rotate-45" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">No trips found.</h2>
              <p className="text-sm sm:text-base text-emerald-100 mb-8 max-w-sm font-medium">
                Create your first itinerary.
              </p>
              <Link
                href="/#planner"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#23816e] hover:bg-emerald-50 font-black text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>Generate a Trip</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-center text-xs text-slate-400">
              Friendly message + clear next step. Users know what to do.
            </p>
          </div>
        ) : processedTrips.length === 0 ? (
          /* Search returned 0 results */
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching trips found</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
              No itineraries matched your search for &quot;{searchQuery}&quot;. Try adjusting your search keywords.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          /* Trips List / Grid */
          <div className="space-y-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    variant="grid"
                    href={`/trips/${trip.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-3">
                {paginatedTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    variant="compact"
                    href={`/trips/${trip.id}`}
                  />
                ))}
              </div>
            )}

            {/* Hands-on Lab: Click any card hint */}
            <div className="flex items-center gap-2 p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 border border-dashed border-indigo-200 text-indigo-900 text-xs sm:text-sm font-medium">
              <Info className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>Click any card to open its detail page.</span>
            </div>

            {/* Bonus Feature: Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-semibold text-slate-500">
                  Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{" "}
                  <strong className="text-slate-800">
                    {Math.min(startIndex + ITEMS_PER_PAGE, processedTrips.length)}
                  </strong>{" "}
                  of <strong className="text-slate-800">{processedTrips.length}</strong> trips
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        safeCurrentPage === page
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
