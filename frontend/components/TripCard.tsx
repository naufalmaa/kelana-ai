"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Users,
  User,
  Heart,
  Utensils,
  Compass,
  Sparkles,
  Palmtree,
  Footprints,
  Tag,
} from "lucide-react";
import { Trip } from "@/types/trip";
import { getDestinationPhoto, getDestinationFlag, formatCurrency } from "@/lib/utils";

export interface TripCardProps {
  trip: Trip;
  isSelected?: boolean;
  onSelect?: (trip: Trip) => void;
  href?: string;
  variant?: "compact" | "grid";
}

// Category Badge Color-Coding helper
function getCategoryBadge(category?: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("luxury")) {
    return {
      label: category || "Luxury",
      className: "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-500/20",
    };
  }
  if (cat.includes("backpacker")) {
    return {
      label: category || "Backpacker",
      className: "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20",
    };
  }
  return {
    label: category || "Standard",
    className: "bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-500/20",
  };
}

// 1. Travel Party / Companion Badge (Solo, Couple, Family)
function getTravelPartyBadge(party?: string) {
  const s = (party || "").toLowerCase();
  if (s.includes("family")) {
    return {
      label: "Family",
      icon: <Users className="h-3 w-3 shrink-0" />,
      className: "bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20",
    };
  }
  if (s.includes("couple")) {
    return {
      label: "Couple",
      icon: <Heart className="h-3 w-3 shrink-0" />,
      className: "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20",
    };
  }
  return {
    label: party || "Solo",
    icon: <User className="h-3 w-3 shrink-0" />,
    className: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20",
  };
}

// 2. Trip Theme / Activity Focus Badge (Cultural & Culinary, Relaxed & Nature, Adventure & Outdoors, Luxury & Sightseeing)
function getTripThemeBadge(theme?: string) {
  const s = (theme || "").toLowerCase();
  if (s.includes("culinary") || s.includes("cultural") || s.includes("food")) {
    return {
      label: "Cultural & Culinary",
      icon: <Utensils className="h-3 w-3 shrink-0" />,
      className: "bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-500/20",
    };
  }
  if (s.includes("nature") || s.includes("relaxed") || s.includes("beach")) {
    return {
      label: "Relaxed & Nature",
      icon: <Palmtree className="h-3 w-3 shrink-0" />,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20",
    };
  }
  if (s.includes("adventure") || s.includes("outdoor")) {
    return {
      label: "Adventure & Outdoors",
      icon: <Compass className="h-3 w-3 shrink-0" />,
      className: "bg-cyan-50 text-cyan-700 border-cyan-200 ring-1 ring-cyan-500/20",
    };
  }
  if (s.includes("luxury") || s.includes("sightseeing")) {
    return {
      label: "Luxury & Sightseeing",
      icon: <Sparkles className="h-3 w-3 shrink-0" />,
      className: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20",
    };
  }
  if (s.includes("backpacker")) {
    return {
      label: "Backpacker",
      icon: <Footprints className="h-3 w-3 shrink-0" />,
      className: "bg-lime-50 text-lime-700 border-lime-200 ring-1 ring-lime-500/20",
    };
  }
  if (!theme) return null;
  return {
    label: theme,
    icon: <Tag className="h-3 w-3 shrink-0" />,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };
}

export function TripCard({
  trip,
  isSelected = false,
  onSelect,
  href,
  variant = "compact",
}: TripCardProps) {
  const tripImg = getDestinationPhoto(trip.destination, trip.country);
  const flag = getDestinationFlag(trip.destination, trip.country);
  const categoryBadge = getCategoryBadge(trip.category);
  const partyBadge = getTravelPartyBadge(trip.travel_style);
  const themeBadge = getTripThemeBadge(trip.trip_theme || (trip.travel_style.includes("&") ? trip.travel_style : undefined));

  // If used as a full card on the /trips history grid
  if (variant === "grid") {
    const cardContent = (
      <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col h-full cursor-pointer">
        {/* Card Image Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <Image
            src={tripImg}
            alt={`${trip.destination}, ${trip.country}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border shadow-xs ${categoryBadge.className} bg-white/90 backdrop-blur-md`}
            >
              {categoryBadge.label}
            </span>
            <span className="text-xs font-bold text-white bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {trip.travel_month}
            </span>
          </div>

          {/* Destination with Country Flag */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl font-black tracking-tight drop-shadow-sm flex items-center gap-2">
              <span className="text-xl shrink-0">{flag}</span>
              <span className="truncate">{trip.destination}</span>
              {trip.country && (
                <>
                  <span className="text-slate-300 text-base font-light">•</span>
                  <span className="text-indigo-200 text-sm font-normal truncate">
                    {trip.country}
                  </span>
                </>
              )}
            </h3>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Budget
              </span>
              <span className="font-black text-slate-800 text-sm truncate block">
                {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Duration
              </span>
              <span className="font-black text-slate-800 text-sm">
                {trip.days} Days
              </span>
            </div>
          </div>

          {/* Badges: Companion (Party) & Theme */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${partyBadge.className}`}
            >
              {partyBadge.icon}
              <span>{partyBadge.label}</span>
            </span>

            {themeBadge && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${themeBadge.className} truncate max-w-[150px]`}
              >
                {themeBadge.icon}
                <span className="truncate">{themeBadge.label}</span>
              </span>
            )}
          </div>

          {/* View Details Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
            <span className="text-slate-500 font-medium">Explore Itinerary</span>
            <span className="flex items-center gap-1 shrink-0">
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    );

    if (href) {
      return <Link href={href} className="block h-full">{cardContent}</Link>;
    }
    if (onSelect) {
      return (
        <div onClick={() => onSelect(trip)} className="h-full">
          {cardContent}
        </div>
      );
    }
    return cardContent;
  }

  // Compact variant (used in the saved sidebar list & list view)
  const compactContent = (
    <div
      className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 group cursor-pointer ${
        isSelected
          ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/60 shadow-xs"
          : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base shrink-0">{flag}</span>
            <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {trip.destination}{trip.country ? `, ${trip.country}` : ""}
            </span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${categoryBadge.className}`}
            >
              {categoryBadge.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium flex-wrap">
            <span className="font-bold text-slate-700">{trip.days} days</span>
            <span>·</span>
            <span className="font-bold text-emerald-700">
              {formatCurrency(trip.budget, trip.currency)}
            </span>
            <span>·</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${partyBadge.className}`}
            >
              {partyBadge.icon}
              <span>{partyBadge.label}</span>
            </span>
            {themeBadge && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${themeBadge.className}`}
              >
                {themeBadge.icon}
                <span className="truncate">{themeBadge.label}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {href ? (
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-colors shrink-0 flex items-center gap-1">
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronRight
          className={`h-4 w-4 transition-transform shrink-0 ${
            isSelected
              ? "text-indigo-600 translate-x-0.5"
              : "text-slate-400 group-hover:text-slate-600"
          }`}
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{compactContent}</Link>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(trip)}
      className="w-full text-left p-0 border-0 bg-transparent focus:outline-none"
    >
      {compactContent}
    </button>
  );
}

export default TripCard;
