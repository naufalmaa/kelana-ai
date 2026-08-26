import { PresetDestination } from "@/types/trip";

export const PRESET_TRIPS: PresetDestination[] = [
  {
    label: "Tokyo, Japan",
    icon: "🌸",
    destination: "Tokyo",
    country: "Japan",
    days: 7,
    budget: 2500,
    currency: "USD",
    travel_style: "Cultural & Culinary",
    travel_month: "April",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop",
    tagline: "Cherry blossoms, neon streets & Michelin dining",
  },
  {
    label: "Bali, Indonesia",
    icon: "🏝️",
    destination: "Bali",
    country: "Indonesia",
    days: 5,
    budget: 8000000,
    currency: "IDR",
    travel_style: "Relaxed & Nature",
    travel_month: "August",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    tagline: "Tropical beaches, lush rice terraces & sacred temples",
  },
  {
    label: "Paris, France",
    icon: "🗼",
    destination: "Paris",
    country: "France",
    days: 6,
    budget: 3200,
    currency: "EUR",
    travel_style: "Luxury & Sightseeing",
    travel_month: "October",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    tagline: "Art galleries, haute couture & Seine cruises",
  },
  {
    label: "Interlaken, Switzerland",
    icon: "🏔️",
    destination: "Interlaken",
    country: "Switzerland",
    days: 8,
    budget: 4500,
    currency: "USD",
    travel_style: "Adventure & Outdoors",
    travel_month: "July",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop",
    tagline: "Alpine vistas, turquoise lakes & mountain peaks",
  },
];

export const DESTINATION_IMAGES: Record<string, string> = {
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
  indonesia: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1200&auto=format&fit=crop",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
  interlaken: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop",
  italy: "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=1200&auto=format&fit=crop",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200&auto=format&fit=crop",
  thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
  seoul: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=1200&auto=format&fit=crop",
  korea: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=1200&auto=format&fit=crop",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop",
  australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1200&auto=format&fit=crop",
};

export const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop";

export const CURRENCIES = ["USD", "IDR", "EUR", "JPY", "GBP", "SGD", "AUD"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const STYLES = [
  "Backpacker",
  "Cultural & Culinary",
  "Relaxed & Nature",
  "Adventure & Outdoors",
  "Luxury & Sightseeing",
  "Family Friendly",
];
