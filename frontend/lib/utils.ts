import { DESTINATION_IMAGES, DEFAULT_HERO_IMAGE } from "./constants";
import { StructuredAiRecommendation } from "@/types/trip";

const COUNTRY_FLAGS: Record<string, string> = {
  japan: "🇯🇵",
  tokyo: "🇯🇵",
  kyoto: "🇯🇵",
  osaka: "🇯🇵",
  indonesia: "🇮🇩",
  bali: "🇮🇩",
  jakarta: "🇮🇩",
  france: "🇫🇷",
  paris: "🇫🇷",
  switzerland: "🇨🇭",
  interlaken: "🇨🇭",
  zurich: "🇨🇭",
  geneva: "🇨🇭",
  usa: "🇺🇸",
  "united states": "🇺🇸",
  "new york": "🇺🇸",
  california: "🇺🇸",
  uk: "🇬🇧",
  "united kingdom": "🇬🇧",
  london: "🇬🇧",
  england: "🇬🇧",
  italy: "🇮🇹",
  rome: "🇮🇹",
  milan: "🇮🇹",
  venice: "🇮🇹",
  florence: "🇮🇹",
  thailand: "🇹🇭",
  bangkok: "🇹🇭",
  phuket: "🇹🇭",
  korea: "🇰🇷",
  "south korea": "🇰🇷",
  seoul: "🇰🇷",
  australia: "🇦🇺",
  sydney: "🇦🇺",
  melbourne: "🇦🇺",
  singapore: "🇸🇬",
  germany: "🇩🇪",
  berlin: "🇩🇪",
  munich: "🇩🇪",
  spain: "🇪🇸",
  madrid: "🇪🇸",
  barcelona: "🇪🇸",
  netherlands: "🇳🇱",
  amsterdam: "🇳🇱",
  canada: "🇨🇦",
  toronto: "🇨🇦",
  vancouver: "🇨🇦",
  uae: "🇦🇪",
  "united arab emirates": "🇦🇪",
  dubai: "🇦🇪",
  turkey: "🇹🇷",
  istanbul: "🇹🇷",
  vietnam: "🇻🇳",
  hanoi: "🇻🇳",
  "da nang": "🇻🇳",
  malaysia: "🇲🇾",
  "kuala lumpur": "🇲🇾",
  egypt: "🇪🇬",
  cairo: "🇪🇬",
  greece: "🇬🇷",
  athens: "🇬🇷",
  santorini: "🇬🇷",
  brazil: "🇧🇷",
  "rio de janeiro": "🇧🇷",
  china: "🇨🇳",
  beijing: "🇨🇳",
  shanghai: "🇨🇳",
  india: "🇮🇳",
  mumbai: "🇮🇳",
  delhi: "🇮🇳",
  mexico: "🇲🇽",
  "mexico city": "🇲🇽",
  cancun: "🇲🇽",
  saudi: "🇸🇦",
  "saudi arabia": "🇸🇦",
  mecca: "🇸🇦",
  medina: "🇸🇦",
  riyadh: "🇸🇦",
};

export function getDestinationFlag(destination?: string, country?: string): string {
  const dKey = (destination || "").toLowerCase().trim();
  const cKey = (country || "").toLowerCase().trim();

  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (dKey.includes(key) || key.includes(dKey) || cKey.includes(key) || key.includes(cKey)) {
      return flag;
    }
  }
  return "📍";
}

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
  const normalizedCur = (cur || "USD").toUpperCase().trim();
  try {
    const formattedNum = Number(val || 0).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    return `${normalizedCur} ${formattedNum}`;
  } catch {
    return `${normalizedCur} ${val || 0}`;
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
