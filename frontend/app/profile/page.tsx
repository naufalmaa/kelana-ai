"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Compass,
  PlusCircle,
  History,
  LogOut,
  ShieldCheck,
  Sparkles,
  Lock,
  LogIn,
  RotateCw,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMeApi } from "@/services/authService";
import { User } from "@/types/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout, openAuthModal } = useAuth();
  const [profile, setProfile] = useState<User | null>(authUser);

  useEffect(() => {
    if (isAuthenticated) {
      getMeApi()
        .then((data) => {
          setProfile(data);
        })
        .catch(() => {
          // Fallback to authUser in context
          if (authUser) setProfile(authUser);
        });
    }
  }, [isAuthenticated, authUser]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const activeUser = profile || authUser;

  const formattedJoinDate = activeUser?.created_at
    ? new Date(activeUser.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {authLoading ? (
          <div className="py-24 text-center space-y-3">
            <RotateCw className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
            <p className="text-sm font-bold text-slate-700">Loading your profile...</p>
          </div>
        ) : !isAuthenticated || !activeUser ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Sign In to View Profile
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
              You must be logged in to view your user profile and generated itineraries.
            </p>
            <button
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl">
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                    {activeUser.email.includes("superadmin") ? (
                      <ShieldCheck className="h-9 w-9 sm:h-11 sm:w-11 text-amber-300" />
                    ) : (
                      <UserIcon className="h-9 w-9 sm:h-11 sm:w-11 text-indigo-200" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        {activeUser.name}
                      </h1>
                      {activeUser.email.includes("superadmin") && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-200 mt-1 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-indigo-300 shrink-0" />
                      <span>{activeUser.email}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <LogOut className="h-4 w-4 text-rose-300" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Profile Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stat Card: Total Trips */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Trips Generated
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    {activeUser.total_trips ?? 0}
                  </p>
                </div>
              </div>

              {/* Stat Card: Account Status */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Account Status
                  </p>
                  <p className="text-sm sm:text-base font-black text-emerald-700 mt-0.5">
                    Active Member
                  </p>
                </div>
              </div>

              {/* Stat Card: Member Since */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Member Since
                  </p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 truncate max-w-[150px]">
                    {formattedJoinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Your Travel Management</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/#planner"
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <PlusCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Plan a New Itinerary
                      </p>
                      <p className="text-xs text-slate-500">
                        Generate new AI trip with custom budget & theme
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/trips"
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Browse Trip History
                      </p>
                      <p className="text-xs text-slate-500">
                        View, search, or export your {activeUser.total_trips ?? 0} saved trips
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
