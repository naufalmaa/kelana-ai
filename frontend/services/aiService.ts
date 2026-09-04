import { AskAiResponse } from "@/types/ai";
import { getAuthToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function askKnowledgeBase(question: string, tokenOverride?: string): Promise<AskAiResponse> {
  const token = tokenOverride || getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to retrieve answer from AI (${res.status})`);
  }

  return res.json();
}
