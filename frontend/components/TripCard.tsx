"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Trip } from "@/types/trip";
import { getDestinationPhoto, formatCurrency } from "@/lib/utils";

export interface TripCardProps {
  trip: Trip;
  isSelected?: boolean;
  onSelect?: (trip: Trip) => void;
  href?: string;
  variant?: "compact" | "grid";
}

export function TripCard({
  trip,
  isSelected = false,
  onSelect,
  href,
  variant = "compact",
}: TripCardProps) {
  const tripImg = getDestinationPhoto(trip.destination, trip.country);

  // Category badge styling
  const categoryBadgeClass =
    trip.category === "Luxury"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : trip.category === "Backpacker"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-blue-100 text-blue-800 border-blue-200";

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
          
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border shadow-xs ${categoryBadgeClass} backdrop-blur-md`}
            >
              {trip.category || "Standard"}
            </span>
            <span className="text-xs font-bold text-white bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {trip.travel_month}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl font-black tracking-tight drop-shadow-sm flex items-center gap-1.5">
              <span>{trip.destination}</span>
              <span className="text-slate-300 text-base font-light">•</span>
              <span className="text-indigo-200 text-sm font-normal">{trip.country}</span>
            </h3>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Budget</span>
              <span className="font-black text-slate-800 text-sm">
                {formatCurrency(trip.budget, trip.currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Duration</span>
              <span className="font-black text-slate-800 text-sm">
                {trip.days} Days
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold group-hover:text-indigo-700">
            <span className="truncate text-slate-600 font-medium">
              {trip.travel_style || "Personalized Tour"}
            </span>
            <span className="flex items-center gap-1 shrink-0 ml-2">
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

  // Compact variant (used in the saved list & list view)
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
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {trip.destination}{trip.country ? `, ${trip.country}` : ""}
            </span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${categoryBadgeClass}`}
            >
              {trip.category || "Standard"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium truncate">
            <span>{trip.days} days</span>
            <span>·</span>
            <span>{formatCurrency(trip.budget, trip.currency)}</span>
            {trip.travel_style && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline truncate">{trip.travel_style}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {href ? (
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-colors shrink-0 flex items-center gap-1">
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
