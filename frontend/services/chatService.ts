import {
  Conversation,
  SendMessageResponse,
} from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * List all conversations belonging to the authenticated user.
 */
export async function listConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch conversations (${res.status})`);
  }

  return res.json();
}

/**
 * Create a new conversation thread.
 */
export async function createConversation(
  token: string,
  title?: string
): Promise<Conversation> {
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ title: title || undefined }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to create conversation (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch a single conversation with its full message history.
 */
export async function getConversation(
  conversationId: number,
  token: string
): Promise<Conversation> {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch conversation (${res.status})`);
  }

  return res.json();
}

/**
 * Rename a conversation title (Bonus Challenge).
 */
export async function renameConversation(
  conversationId: number,
  title: string,
  token: string
): Promise<Conversation> {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to rename conversation (${res.status})`);
  }

  return res.json();
}

/**
 * Delete a conversation.
 */
export async function deleteConversation(
  conversationId: number,
  token: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to delete conversation (${res.status})`);
  }

  return res.json();
}

/**
 * Send a message within a conversation thread and get Amazon Bedrock's response.
 */
export async function sendMessage(
  conversationId: number,
  content: string,
  token: string
): Promise<SendMessageResponse> {
  const res = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to send message (${res.status})`);
  }

  return res.json();
}
