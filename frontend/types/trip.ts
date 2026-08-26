export interface DailyItineraryItem {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  daily_tip?: string;
}

export interface TravelTipItem {
  title: string;
  tip: string;
}

export interface FoodRecommendationItem {
  dish: string;
  description: string;
  recommended_spot: string;
}

export interface BudgetBreakdownItem {
  category: string;
  percentage: number;
  estimated_amount: number;
  description: string;
}

export interface StructuredAiRecommendation {
  trip_overview?: string;
  daily_itinerary?: DailyItineraryItem[];
  travel_tips?: TravelTipItem[];
  food_recommendations?: FoodRecommendationItem[];
  budget_breakdown?: BudgetBreakdownItem[];
}

export interface Trip {
  id: number;
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  category: string;
  daily_budget: number;
  travel_style: string;
  travel_month: string;
  ai_recommendation: string;
  created_at?: string;
}

export interface TripFormData {
  destination: string;
  country: string;
  days: number;
  budget: number;
  currency: string;
  travel_style: string;
  travel_month: string;
}

export interface PresetDestination extends TripFormData {
  label: string;
  icon: string;
  image: string;
  tagline: string;
}

export interface TripCardProps {
  trip: Trip;
  isSelected?: boolean;
  onSelect?: (trip: Trip) => void;
  href?: string;
}
