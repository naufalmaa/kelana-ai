"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  listConversations,
  getConversation,
  createConversation,
  renameConversation,
  deleteConversation,
  sendMessage,
} from "@/services/chatService";
import { Conversation, Message } from "@/types/chat";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  Bot,
  User as UserIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  CheckCheck,
  RotateCcw,
  Menu,
  ShieldAlert,
  Clock,
} from "lucide-react";

function ChatContent() {
  const router = useRouter();
  const { user, token, isAuthenticated, isHydrated, openAuthModal } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  
  // Loading states
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sidebar & Rename State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [editingConvId, setEditingConvId] = useState<number | null>(null);
  const [editTitleInput, setEditTitleInput] = useState<string>("");
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll helper (Requirement 2: Auto-scroll to latest message)
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Format date helper (Requirement 4: Timestamp for each message)
  const formatDate = (isoString?: string) => {
    if (!isoString) {
      const now = new Date();
      return now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load user's conversations
  const fetchConversations = useCallback(
    async (selectId?: number) => {
      if (!token) return;
      try {
        setLoadingConversations(true);
        const list = await listConversations(token);
        setConversations(list);

        if (list.length > 0) {
          const targetId = selectId || activeConversationId || list[0].id;
          const found = list.find((c) => c.id === targetId) || list[0];
          setActiveConversationId(found.id);
        } else {
          setActiveConversationId(null);
          setActiveConversation(null);
          setMessages([]);
        }
      } catch (err: any) {
        console.error("Failed to load conversations:", err);
        setErrorMessage(err.message || "Failed to load conversation history");
      } finally {
        setLoadingConversations(false);
      }
    },
    [token, activeConversationId]
  );

  // Initial load
  useEffect(() => {
    if (isHydrated && token) {
      fetchConversations();
    } else if (isHydrated && !token) {
      setLoadingConversations(false);
    }
  }, [isHydrated, token]);

  // Load active conversation's messages
  useEffect(() => {
    if (!activeConversationId || !token) {
      setMessages([]);
      setActiveConversation(null);
      return;
    }

    let isMounted = true;
    const loadActive = async () => {
      try {
        setLoadingMessages(true);
        setErrorMessage(null);
        const data = await getConversation(activeConversationId, token);
        if (isMounted) {
          setActiveConversation(data);
          setMessages(data.messages || []);
          setTimeout(() => scrollToBottom(false), 50);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load conversation messages:", err);
          setErrorMessage(err.message || "Failed to load messages");
        }
      } finally {
        if (isMounted) {
          setLoadingMessages(false);
        }
      }
    };

    loadActive();

    return () => {
      isMounted = false;
    };
  }, [activeConversationId, token, scrollToBottom]);

  // Handle New Chat creation
  const handleNewChat = async () => {
    if (!token) {
      openAuthModal("login");
      return;
    }
    try {
      setErrorMessage(null);
      const newConv = await createConversation(token, "New Conversation");
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setActiveConversation(newConv);
      setMessages([]);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      setTimeout(() => textareaRef.current?.focus(), 100);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create new conversation");
    }
  };

  // Handle Send Message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isSending) return;

    if (!token) {
      openAuthModal("login");
      return;
    }

    setErrorMessage(null);
    setInputMessage("");

    // If no active conversation, create one first
    let convId = activeConversationId;
    if (!convId) {
      try {
        const newConv = await createConversation(token, "New Conversation");
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setActiveConversation(newConv);
        convId = newConv.id;
      } catch (err: any) {
        setErrorMessage("Failed to initialize conversation thread.");
        return;
      }
    }

    // Optimistic user message preview
    const tempUserMsg: Message = {
      id: Date.now(),
      conversation_id: convId,
      role: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const response = await sendMessage(convId, textToSend, token);

      // Update message list with persisted user & assistant response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, response.user_message, response.assistant_message];
      });

      // Update conversation title if modified
      if (response.conversation_title) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, title: response.conversation_title } : c
          )
        );
        setActiveConversation((prev) =>
          prev ? { ...prev, title: response.conversation_title } : null
        );
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setErrorMessage(err.message || "Failed to receive response from Bedrock.");
      // Rollback optimistic message or mark error
    } finally {
      setIsSending(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  // Handle Rename Conversation (Bonus Challenge)
  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitleInput(conv.title);
  };

  const saveRename = async (convId: number, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (!token || !editTitleInput.trim()) {
      setEditingConvId(null);
      return;
    }

    try {
      const updated = await renameConversation(convId, editTitleInput.trim(), token);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: updated.title } : c))
      );
      if (activeConversationId === convId) {
        setActiveConversation((prev) => (prev ? { ...prev, title: updated.title } : null));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to rename conversation.");
    } finally {
      setEditingConvId(null);
    }
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(null);
  };

  // Handle Delete Conversation
  const handleDeleteConversation = async (convId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;

    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await deleteConversation(convId, token);
      const remaining = conversations.filter((c) => c.id !== convId);
      setConversations(remaining);

      if (activeConversationId === convId) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          setActiveConversationId(null);
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete conversation.");
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Suggested Prompts
  const suggestedPrompts = [
    "Plan a 5-day Japan trip with family-friendly stops.",
    "What are the best street food spots in Singapore?",
    "Suggest a 4-day budget backpacking route in Korea.",
    "Give me a relaxed 3-day romantic itinerary in Bali.",
  ];

  return (
    <div className="h-screen max-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-2 sm:p-3 md:p-4 flex flex-col overflow-hidden">
        {/* Unauthenticated Banner */}
        {isHydrated && !isAuthenticated && (
          <div className="mb-3 shrink-0 bg-indigo-50 border border-indigo-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Welcome to KelanaAI Multi-turn Chat
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1 sm:line-clamp-none">
                  Sign in or register to save conversations, continue previous threads, and access personalized AI travel context.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthModal("login")}
              className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:scale-105"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Main Chat Container */}
        <div className="flex-1 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: Conversations List (Part 7 & Core Challenge)  */}
          {/* ============================================================ */}
          <aside
            className={`transition-all duration-300 ease-in-out border-r border-slate-200/80 bg-slate-50/70 flex flex-col h-full overflow-hidden ${
              isSidebarOpen ? "w-full md:w-80" : "hidden md:flex md:w-16"
            } ${
              !isSidebarOpen && "items-center"
            } shrink-0`}
          >
            {/* Sidebar Header */}
            <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
              {isSidebarOpen ? (
                <>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Conversations
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {conversations.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleNewChat}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
                      title="New Chat"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">New</span>
                    </button>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      title="Collapse sidebar"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                    title="Expand conversations"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNewChat}
                    className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    title="New Chat"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Conversation List Items */}
            {isSidebarOpen && (
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-1.5 divide-y-0">
                {loadingConversations ? (
                  <div className="p-4 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-400">Loading history...</p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No conversations yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Click "+ New" or send a message to start planning your dream trip.
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    const isEditing = editingConvId === conv.id;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          if (!isEditing) {
                            setActiveConversationId(conv.id);
                            if (window.innerWidth < 768) {
                              setIsSidebarOpen(false);
                            }
                          }
                        }}
                        className={`group relative rounded-2xl p-2.5 cursor-pointer transition-all flex items-center justify-between gap-2 border ${
                          isActive
                            ? "bg-white border-indigo-300 shadow-sm shadow-indigo-100 text-slate-900"
                            : "bg-transparent border-transparent hover:bg-slate-200/40 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-slate-200/60 text-slate-400 group-hover:text-slate-600"
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>

                          {isEditing ? (
                            <div
                              className="flex items-center gap-1 flex-1 min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editTitleInput}
                                onChange={(e) => setEditTitleInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveRename(conv.id);
                                  if (e.key === "Escape") setEditingConvId(null);
                                }}
                                autoFocus
                                className="w-full text-xs font-semibold px-2 py-1 rounded border border-indigo-500 outline-none bg-white text-slate-900"
                              />
                              <button
                                onClick={(e) => saveRename(conv.id, e)}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                                title="Save title"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelRename}
                                className="p-1 rounded text-slate-400 hover:bg-slate-100"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs font-bold truncate ${
                                  isActive ? "text-indigo-950" : "text-slate-800"
                                }`}
                              >
                                {conv.title || "Untitled Conversation"}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 inline" />
                                {formatDate(conv.created_at)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons (Rename & Delete) */}
                        {!isEditing && (
                          <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => startEditing(conv, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Rename chat (Bonus)"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </aside>

          {/* ============================================================ */}
          {/* MAIN CHAT AREA (Part 6 & Hands-on Lab)                      */}
          {/* ============================================================ */}
          <section className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden relative">
            {/* Chat Top Header (Requirement 1: Conversation Title) */}
            <div className="px-4 py-3 border-b border-slate-100 bg-white/95 backdrop-blur flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors md:hidden"
                    title="Show conversations"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-sm font-black text-slate-900 truncate"
                      title={activeConversation?.title || "KelanaAI Chat"}
                    >
                      {activeConversation?.title || "KelanaAI Chat"}
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Amazon Bedrock Converse • Context-Aware
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewChat}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mx-4 mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between gap-2 shadow-sm animate-fadeIn shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Message History Viewport */}
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4"
            >
              {loadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500 font-medium">
                    Loading conversation thread...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                /* Empty State with Suggested Prompts */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
                  <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-md shadow-indigo-100">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Where would you like to explore?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm">
                    Ask me for personalized itineraries, local food recommendations, daily pacing, or transit advice.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="p-3 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 rounded-2xl text-xs font-medium text-slate-700 hover:text-indigo-900 transition-all shadow-sm hover:shadow group flex items-start gap-2"
                      >
                        <Compass className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0 group-hover:rotate-45 transition-transform" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Render Messages */
                messages.map((msg, index) => {
                  const isUser = msg.role === "user";

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-3xl ${
                        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
                      } animate-fadeIn`}
                    >
                      {/* Assistant Avatar */}
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`group relative rounded-3xl px-4 sm:px-5 py-3.5 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 rounded-tr-none"
                            : "bg-slate-50/90 border border-slate-200/80 text-slate-800 shadow-sm rounded-tl-none"
                        }`}
                      >
                        {/* Message Content */}
                        {isUser ? (
                          <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                        ) : (
                          <div className="text-slate-800 text-xs sm:text-sm leading-relaxed max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-base sm:text-lg font-black text-indigo-950 mt-4 mb-2 pb-1.5 border-b border-slate-200 flex items-center gap-2">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-sm sm:text-base font-black text-indigo-900 mt-3.5 mb-2 flex items-center gap-1.5">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-3 mb-1">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="my-2 leading-relaxed text-slate-800">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-extrabold text-indigo-950">
                                    {children}
                                  </strong>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="my-3 border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50/90 to-violet-50/50 rounded-r-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 shadow-xs italic">
                                    {children}
                                  </blockquote>
                                ),
                                table: ({ children }) => (
                                  <div className="my-3.5 overflow-x-auto rounded-2xl border border-indigo-100 shadow-sm bg-white">
                                    <table className="w-full text-left text-xs border-collapse min-w-[340px]">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }) => (
                                  <thead className="bg-gradient-to-r from-indigo-100/80 via-indigo-50 to-violet-50 text-indigo-950 font-bold border-b border-indigo-200/80">
                                    {children}
                                  </thead>
                                ),
                                th: ({ children }) => (
                                  <th className="px-3.5 py-2.5 text-[11px] font-black uppercase tracking-wider text-indigo-950">
                                    {children}
                                  </th>
                                ),
                                tbody: ({ children }) => (
                                  <tbody className="divide-y divide-slate-100">
                                    {children}
                                  </tbody>
                                ),
                                tr: ({ children }) => (
                                  <tr className="hover:bg-indigo-50/40 transition-colors even:bg-slate-50/60">
                                    {children}
                                  </tr>
                                ),
                                td: ({ children }) => (
                                  <td className="px-3.5 py-2.5 text-slate-700 text-xs">
                                    {children}
                                  </td>
                                ),
                                ul: ({ children }) => (
                                  <ul className="my-2 space-y-1.5 list-disc list-outside pl-5 text-slate-700">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="my-2 space-y-1.5 list-decimal list-outside pl-5 text-slate-700">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed my-0.5">
                                    {children}
                                  </li>
                                ),
                                hr: () => (
                                  <hr className="my-4 border-t-2 border-dashed border-slate-200" />
                                ),
                                code: ({ className, children, ...props }: any) => (
                                  <code
                                    className="bg-indigo-50 text-indigo-700 font-mono text-[11px] px-1.5 py-0.5 rounded-md border border-indigo-200"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}

                        {/* Message Footer / Timestamp (Requirement 4: Timestamp for each message) */}
                        <div
                          className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${
                            isUser ? "text-indigo-200" : "text-slate-400"
                          }`}
                        >
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 inline opacity-75 shrink-0" />
                            <span>{formatDate(msg.created_at)}</span>
                          </span>
                          {!isUser && (
                            <button
                              onClick={() => copyToClipboard(msg.content, msg.id || index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 flex items-center gap-1"
                              title="Copy response"
                            >
                              {copiedMessageId === (msg.id || index) ? (
                                <>
                                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 text-[9px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="text-[9px]">Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {isUser && (
                        <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Typing / Thinking Indicator (Requirement 3: Typing indicator) */}
              {isSending && (
                <div className="flex gap-3 max-w-3xl mr-auto justify-start animate-fadeIn">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-3xl rounded-tl-none px-5 py-3.5 shadow-sm flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                      <span>KelanaAI is thinking...</span>
                      <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">
                        (Processing with Amazon Bedrock)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/50 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="max-w-4xl mx-auto flex items-end gap-2 bg-white border border-slate-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl p-2 shadow-sm transition-all"
              >
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={
                    isAuthenticated
                      ? "Ask KelanaAI anything (e.g. Plan a Japan trip, What about Day 2?)..."
                      : "Type a prompt or sign in to save your conversation history..."
                  }
                  className="flex-1 max-h-32 min-h-[38px] p-2 text-xs sm:text-sm bg-transparent outline-none resize-none text-slate-900 placeholder:text-slate-400"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md shrink-0 ${
                    !inputMessage.trim() || isSending
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:scale-105 active:scale-95"
                  }`}
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[10px] text-center text-slate-400 mt-2">
                KelanaAI maintains context history across turns. Press Enter to send, Shift+Enter for new lines.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold">Loading KelanaAI Chat...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

