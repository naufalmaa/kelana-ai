"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  Sparkles,
  Bot,
  User,
  X,
  Minus,
  Send,
  Loader2,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Compass,
  ArrowRight,
  Lock,
  LogIn,
} from "lucide-react";
import { useAskAi } from "@/context/AskAiContext";
import { useAuth } from "@/context/AuthContext";
import { SourceDocument } from "@/types/ai";

const QUICK_PROMPTS = [
  "What are the best tips and facilities for Sumida Aquarium in Tokyo?",
  "How do transportation passes and metro work in Tokyo?",
  "What are the top must-visit cultural sights and temples in Japan?",
  "What are the signature local foods to try in Tokyo?",
];

export function AskAiFloatingWidget() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    toggleChat,
    toggleMinimize,
    closeChat,
    sendMessage,
    clearMessages,
    pendingQuestion,
    setPendingQuestion,
  } = useAskAi();

  const [inputVal, setInputVal] = useState("");
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync pending question from context (e.g. triggered from Itinerary button)
  useEffect(() => {
    if (pendingQuestion) {
      setInputVal(pendingQuestion);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [pendingQuestion]);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (isOpen && !isMinimized && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    sendMessage(inputVal);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleSourceExpand = (sourceKey: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [sourceKey]: !prev[sourceKey],
    }));
  };

  const handleQuickPromptClick = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <>
      {/* 1. Floating Action Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <button
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal("login");
              return;
            }
            toggleChat();
          }}
          aria-label="Toggle Ask AI Travel Concierge"
          className="group relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
        >
          {/* Glowing pulse indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>

          <Bot className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
          <span className="hidden sm:inline tracking-tight font-black">Ask AI</span>
          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />

          {/* Unread / Ready Badge */}
          <span className="hidden md:inline-flex items-center text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            RAG
          </span>
        </button>
      </div>

      {/* 2. Floating Chat Dialog */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-6 ${
            isMinimized ? "h-16" : "h-[640px] max-h-[82vh]"
          }`}
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-indigo-900/50 select-none">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-inner shrink-0">
                <Compass className="h-5 w-5 text-white animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-tight">
                    KelanaAI Concierge
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Bedrock RAG
                  </span>
                </div>
                <p className="text-[11px] text-slate-300/80 line-clamp-1">
                  Answers backed by verified travel PDF guides
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearMessages}
                title="Clear Conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={toggleMinimize}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={closeChat}
                title="Close"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body Content (if not minimized) */}
          {!isMinimized && (
            <>
              {!isAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/80">
                  <div className="h-16 w-16 rounded-3xl bg-indigo-100/80 border border-indigo-200/60 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
                    <Lock className="h-8 w-8" />
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 tracking-tight">
                    Sign In Required
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                    KelanaAI Travel Concierge is exclusively available to registered travelers. Please sign in or create an account to start asking verified travel questions!
                  </p>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In / Create Account</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Messages Scroll Area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-slate-50/60"
              >
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isUser
                            ? "bg-indigo-600 text-white rounded-tr-xs"
                            : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                        }`}
                      >
                        {/* Loading State */}
                        {msg.loading ? (
                          <div className="flex items-center gap-2.5 py-1 text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            <span className="text-xs font-medium animate-pulse">
                              Searching travel knowledge base & generating answer...
                            </span>
                          </div>
                        ) : (
                          <>
                            {/* Message Markdown Body */}
                            <div className="prose prose-xs sm:prose-sm max-w-none prose-slate prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>

                            {/* Source Documents Section (Requirement 1, 2, 3) */}
                            {msg.source_documents && msg.source_documents.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                                  <span>Source Documents & Verified Citations:</span>
                                </div>

                                <div className="space-y-2">
                                  {msg.source_documents.map((doc: SourceDocument, docIdx: number) => {
                                    const sourceNumber = docIdx + 1;
                                    const sourceKey = `${msg.id}-doc-${docIdx}`;
                                    const isExpanded = !!expandedSources[sourceKey];
                                    const relevancePercentage = doc.score
                                      ? Math.round(doc.score * 100)
                                      : null;

                                    return (
                                      <div
                                        key={sourceKey}
                                        className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 text-xs text-slate-700 transition-all hover:bg-indigo-50/80"
                                      >
                                        {/* Header with Number [N], Title & PDF Link */}
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex items-start gap-2 flex-1 min-w-0">
                                            {/* Number badge */}
                                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-indigo-600 text-white font-extrabold text-[11px] shrink-0 shadow-2xs">
                                              [{sourceNumber}]
                                            </span>

                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-slate-900 truncate">
                                                  {doc.document_title || "Official Travel Guide"}
                                                </span>
                                                {relevancePercentage && (
                                                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                                    {relevancePercentage}% Match
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Clickable PDF Button (opens link in new tab) */}
                                          {doc.source_uri ? (
                                            <a
                                              href={doc.source_uri}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              title={`Open ${doc.document_title || "Source PDF"} in new tab`}
                                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-[11px] shadow-2xs transition-colors shrink-0 cursor-pointer"
                                            >
                                              <FileText className="h-3 w-3" />
                                              <span>Open PDF</span>
                                              <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                                            </a>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-medium">
                                              <FileText className="h-3 w-3" />
                                              Knowledge Base
                                            </span>
                                          )}
                                        </div>

                                        {/* Toggleable Text Excerpt */}
                                        {doc.content && (
                                          <div className="mt-2 pt-2 border-t border-indigo-100/70">
                                            <button
                                              onClick={() => toggleSourceExpand(sourceKey)}
                                              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                                            >
                                              <span>
                                                {isExpanded
                                                  ? "Hide source excerpt"
                                                  : `View excerpt from [${sourceNumber}]`}
                                              </span>
                                              {isExpanded ? (
                                                <ChevronUp className="h-3 w-3" />
                                              ) : (
                                                <ChevronDown className="h-3 w-3" />
                                              )}
                                            </button>

                                            {isExpanded && (
                                              <div className="mt-1.5 p-2 rounded-lg bg-white/90 border border-indigo-100 text-[11px] text-slate-600 font-mono leading-normal max-h-36 overflow-y-auto custom-scrollbar">
                                                {doc.content}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Timestamp */}
                            <div
                              className={`mt-2 text-[10px] flex items-center gap-1 ${
                                isUser ? "text-indigo-200 justify-end" : "text-slate-400"
                              }`}
                            >
                              <span>{msg.timestamp}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {isUser && (
                        <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Suggested Quick Prompts if only 1 message exists */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <HelpCircle className="h-3 w-3 text-indigo-600" />
                      Suggested questions:
                    </p>
                    <div className="space-y-1.5">
                      {QUICK_PROMPTS.map((promptText, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickPromptClick(promptText)}
                          className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-xs text-slate-700 hover:text-indigo-900 font-medium transition-all shadow-2xs flex items-center justify-between group cursor-pointer"
                        >
                          <span className="line-clamp-1">{promptText}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSubmit}
                className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about places, tips, or itinerary..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-600 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all max-h-24 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="h-10 w-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  title="Send Question"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
