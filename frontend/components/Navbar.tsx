"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  Sparkles,
  RotateCw,
  History,
  PlusCircle,
  LogOut,
  LogIn,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

export interface NavbarProps {
  backendOnline?: boolean | null;
  onRefresh?: () => void;
  loading?: boolean;
}

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Navbar({
  backendOnline = null,
  onRefresh,
  loading = false,
}: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const isHydrated = useHydrated();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
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
              href="/#planner"
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
            {isHydrated && isAuthenticated && (
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Profile</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Status, Welcome Message, User Auth & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Status Indicator (Only if explicitly passed and hydrated) */}
          {isHydrated && backendOnline !== null && (
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
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
              <span className="text-[11px]">
                {backendOnline === true
                  ? "Online"
                  : backendOnline === false
                  ? "Offline"
                  : "Checking..."}
              </span>
            </div>
          )}

          {/* Quick link to history on mobile */}
          <Link
            href="/trips"
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl"
            title="Trip History"
          >
            <History className="h-3.5 w-3.5 text-slate-600" />
          </Link>

          {/* Refresh Button */}
          {isHydrated && onRefresh && (
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
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

          {/* User Auth Section (Hydration Safe) */}
          {isHydrated && isAuthenticated && user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              {/* Challenge Bonus: Personalized Welcome Message in Navbar */}
              <span className="hidden lg:inline text-xs font-medium text-slate-600 pr-1">
                Welcome back, <span className="font-bold text-slate-900">{user.name}</span> 👋
              </span>

              {/* User Profile Pill linking to /profile */}
              <Link
                href="/profile"
                title="View Profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-900 shadow-2xs transition-colors cursor-pointer"
              >
                {user.email.includes("superadmin") ? (
                  <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                ) : (
                  <UserIcon className="h-4 w-4 text-indigo-600 shrink-0" />
                )}
                <span className="text-xs font-bold truncate max-w-[90px] sm:max-w-[140px]">
                  {user.name}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-500" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : isHydrated ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="hidden sm:flex px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 items-center gap-1.5 cursor-pointer"
              >
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="h-8 w-24 rounded-xl bg-slate-100 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
