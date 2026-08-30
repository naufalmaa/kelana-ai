import { Trip, TripFormData } from "@/types/trip";
import { getAuthToken } from "./authService";

// Read API URL from .env - no more hardcoding
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Base URL for health check
const BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

function getAuthHeaders(tokenOverride?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = tokenOverride || getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function getTrips(tokenOverride?: string): Promise<Trip[]> {
  const headers = getAuthHeaders(tokenOverride);
  const res = await fetch(`${API_URL}/trips`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Unable to fetch trips: ${res.statusText}`);
  }
  return res.json();
}

export async function getTrip(id: number | string, tokenOverride?: string): Promise<Trip> {
  const headers = getAuthHeaders(tokenOverride);
  const res = await fetch(`${API_URL}/trips/${id}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Unable to fetch trip #${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function generateTrip(
  data: TripFormData | Record<string, unknown>,
  tokenOverride?: string
): Promise<Trip> {
  const headers = getAuthHeaders(tokenOverride);
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers,
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

export async function updateTrip(
  id: number | string,
  data: TripFormData | Record<string, unknown>,
  tokenOverride?: string
): Promise<Trip> {
  const headers = getAuthHeaders(tokenOverride);
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to update trip #${id} (${res.status})`
    );
  }
  return res.json();
}

export async function deleteTrip(id: number | string, tokenOverride?: string): Promise<{ message: string }> {
  const headers = getAuthHeaders(tokenOverride);
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to delete trip #${id}`);
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
