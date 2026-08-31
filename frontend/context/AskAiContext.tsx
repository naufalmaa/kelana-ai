"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ChatMessage, SourceDocument } from "@/types/ai";
import { askKnowledgeBase } from "@/services/aiService";

interface AskAiContextType {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  openChat: (initialQuestion?: string, autoSend?: boolean) => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  sendMessage: (questionText: string) => Promise<void>;
  clearMessages: () => void;
  pendingQuestion: string;
  setPendingQuestion: (q: string) => void;
}

const AskAiContext = createContext<AskAiContextType | undefined>(undefined);

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content:
    "👋 Hello! I am your **KelanaAI Travel Concierge**, powered by AWS Bedrock Knowledge Base. Ask me any travel questions, local tips, transportation guides, or attractions to get verified recommendations backed by official travel documents!",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  source_documents: [],
};

export function AskAiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");

  const sendMessage = useCallback(async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: trimmed,
      timestamp: nowTime,
    };

    const loadingAssistantMsg: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: nowTime,
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingAssistantMsg]);
    setIsLoading(true);
    setPendingQuestion("");

    try {
      const response = await askKnowledgeBase(trimmed);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: response.answer || "I received your question but couldn't generate an answer.",
              source_documents: response.source_documents || [],
              loading: false,
            };
          }
          return msg;
        })
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to retrieve response from AI.";
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              content: `⚠️ **Error retrieving answer:**\n${errorMsg}\n\nPlease verify that the backend server is running and connected to AWS Bedrock.`,
              loading: false,
              error: true,
            };
          }
          return msg;
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const openChat = useCallback((initialQuestion?: string, autoSend: boolean = false) => {
    setIsOpen(true);
    setIsMinimized(false);
    if (initialQuestion) {
      if (autoSend) {
        sendMessage(initialQuestion);
      } else {
        setPendingQuestion(initialQuestion);
      }
    }
  }, [sendMessage]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return (
    <AskAiContext.Provider
      value={{
        isOpen,
        isMinimized,
        messages,
        isLoading,
        openChat,
        closeChat,
        toggleChat,
        toggleMinimize,
        sendMessage,
        clearMessages,
        pendingQuestion,
        setPendingQuestion,
      }}
    >
      {children}
    </AskAiContext.Provider>
  );
}

export function useAskAi() {
  const context = useContext(AskAiContext);
  if (!context) {
    throw new Error("useAskAi must be used within an AskAiProvider");
  }
  return context;
}
