import { Trip, TripFormData } from "@/types/trip";

// Read API URL from .env - no more hardcoding
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Base URL for health check
const BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Unable to fetch trips: ${res.statusText}`);
  }
  return res.json();
}

export async function getTrip(id: number | string): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Unable to fetch trip #${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function generateTrip(data: TripFormData | Record<string, unknown>): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to generate trip (${res.status})`
    );
  }
  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
