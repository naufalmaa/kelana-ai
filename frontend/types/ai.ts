export interface SourceDocument {
  document_title: string;
  source_uri: string;
  content: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface AskAiResponse {
  question: string;
  answer: string;
  source_documents: SourceDocument[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source_documents?: SourceDocument[];
  loading?: boolean;
  error?: boolean;
}
