import { DESTINATION_IMAGES, DEFAULT_HERO_IMAGE } from "./constants";
import { StructuredAiRecommendation } from "@/types/trip";

export function getDestinationPhoto(destination?: string, country?: string): string {
  if (!destination && !country) return DEFAULT_HERO_IMAGE;
  const dKey = (destination || "").toLowerCase().trim();
  const cKey = (country || "").toLowerCase().trim();

  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (dKey.includes(key) || key.includes(dKey) || cKey.includes(key) || key.includes(cKey)) {
      return url;
    }
  }
  return DEFAULT_HERO_IMAGE;
}

export function formatCurrency(val: number, cur: string = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val || 0);
  } catch {
    return `${cur} ${(val || 0).toLocaleString()}`;
  }
}

export function parseRecommendation(raw?: string): StructuredAiRecommendation | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed.daily_itinerary ||
        parsed.travel_tips ||
        parsed.food_recommendations ||
        parsed.budget_breakdown)
    ) {
      return parsed as StructuredAiRecommendation;
    }
  } catch {
    // not JSON or legacy string format
  }
  return null;
}
