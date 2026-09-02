export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  title?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  messages?: Message[];
}

export interface SendMessageResponse {
  conversation_id: number;
  conversation_title: string;
  user_message: Message;
  assistant_message: Message;
}

export interface CreateConversationRequest {
  title?: string;
}

export interface RenameConversationRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
}
