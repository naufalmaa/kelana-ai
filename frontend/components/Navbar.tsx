"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles, RotateCw, History, PlusCircle } from "lucide-react";

export interface NavbarProps {
  backendOnline?: boolean | null;
  onRefresh?: () => void;
  loading?: boolean;
}

export function Navbar({
  backendOnline = null,
  onRefresh,
  loading = false,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0 group-hover:scale-105 transition-transform">
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
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200 text-xs font-bold">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Planner</span>
            </Link>
            <Link
              href="/trips"
              className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <History className="h-3.5 w-3.5" />
              <span>History</span>
            </Link>
          </nav>
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

          {/* Quick link to history on mobile */}
          <Link
            href="/trips"
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
            title="Trip History"
          >
            <History className="h-3.5 w-3.5 text-slate-600" />
          </Link>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Itineraries"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RotateCw
                className={`h-3.5 w-3.5 text-slate-600 ${
                  loading ? "animate-spin text-indigo-600" : ""
                }`}
              />
              <span className="hidden sm:inline">Sync Trips</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
