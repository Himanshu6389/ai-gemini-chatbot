"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  id: string | number;
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

const initialMessages: Message[] = [
  {
    id: "initial-message",
    role: "assistant",
    content:
      "Hi! I'm GeminiChat. Ask me anything and I'll do my best to help.",
  },
];

const MAX_MESSAGE_LENGTH = 4000;
const MAX_TITLE_LENGTH = 100;

export default function ChatPage() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [conversationTitle, setConversationTitle] =
    useState("New conversation");

  const [copiedMessageId, setCopiedMessageId] =
    useState<string | number | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const [editingConversationId, setEditingConversationId] =
    useState<string | null>(null);

  const [editingTitle, setEditingTitle] =
    useState("");

  const [isRenaming, setIsRenaming] =
    useState(false);

  const [deletingConversationId, setDeletingConversationId] =
    useState<string | null>(null);

  const [isRetrying, setIsRetrying] =
    useState(false);

  const [lastFailedMessage, setLastFailedMessage] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const renameInputRef =
    useRef<HTMLInputElement>(null);

  async function handleCopyMessage(
    messageId: string | number,
    content: string
  ) {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedMessageId(messageId);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy message:",
        error
      );
    }
  }

  async function refreshConversations() {
    try {
      const response = await fetch(
        "/api/conversations",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load conversations."
        );
      }

      const data = await response.json();

      setConversations(data.conversations);
    } catch (error) {
      console.error(
        "Failed to refresh conversations:",
        error
      );
    }
  }

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch(
          "/api/conversations",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load conversations."
          );
        }

        const data = await response.json();

        setConversations(data.conversations);
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow =
      isMobileSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    if (editingConversationId) {
      setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 0);
    }
  }, [editingConversationId]);

  async function loadConversation(id: string) {
    try {
      setError("");

      setLastFailedMessage(null);

      const response = await fetch(
        `/api/conversations/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load conversation."
        );
      }

      setConversationId(data.conversation.id);

      setConversationTitle(
        data.conversation.title
      );

      const loadedMessages: Message[] =
        data.messages.map(
          (message: {
            id: string;
            role: "user" | "assistant";
            content: string;
          }) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })
        );

      setMessages(loadedMessages);

      setEditingConversationId(null);
      setEditingTitle("");

      setIsMobileSidebarOpen(false);
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load conversation."
      );
    }
  }

  function handleNewConversation() {
    setConversationId(null);

    setConversationTitle("New conversation");

    setMessages(initialMessages);

    setInput("");

    setError("");

    setLastFailedMessage(null);

    setEditingConversationId(null);

    setEditingTitle("");

    setIsMobileSidebarOpen(false);

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }
  }

  function handleStartRename(
    conversation: Conversation
  ) {
    setEditingConversationId(conversation.id);

    setEditingTitle(conversation.title);

    setError("");
  }

  function handleCancelRename() {
    setEditingConversationId(null);

    setEditingTitle("");

    setIsRenaming(false);
  }

  async function handleRenameConversation(
    conversationIdToRename: string
  ) {
    const trimmedTitle =
      editingTitle.trim();

    if (!trimmedTitle) {
      setError(
        "Conversation title is required."
      );

      return;
    }

    if (
      trimmedTitle.length >
      MAX_TITLE_LENGTH
    ) {
      setError(
        `Conversation title must be ${MAX_TITLE_LENGTH} characters or fewer.`
      );

      return;
    }

    try {
      setIsRenaming(true);

      setError("");

      const response = await fetch(
        `/api/conversations/${conversationIdToRename}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to rename conversation."
        );
      }

      setConversations((currentConversations) =>
        currentConversations.map(
          (conversation) =>
            conversation.id ===
            conversationIdToRename
              ? {
                  ...conversation,
                  title: trimmedTitle,
                  updatedAt:
                    data.conversation
                      ?.updatedAt ??
                    conversation.updatedAt,
                }
              : conversation
        )
      );

      if (
        conversationId ===
        conversationIdToRename
      ) {
        setConversationTitle(
          trimmedTitle
        );
      }

      setEditingConversationId(null);

      setEditingTitle("");
    } catch (error) {
      console.error(
        "Rename conversation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to rename conversation."
      );
    } finally {
      setIsRenaming(false);
    }
  }

  async function handleDeleteConversation(
    conversationIdToDelete: string
  ) {
    const conversationToDelete =
      conversations.find(
        (conversation) =>
          conversation.id ===
          conversationIdToDelete
      );

    const shouldDelete =
      window.confirm(
        `Delete "${conversationToDelete?.title ?? "this conversation"}"?\n\nThis action cannot be undone.`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingConversationId(
        conversationIdToDelete
      );

      setError("");

      const response = await fetch(
        `/api/conversations/${conversationIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete conversation."
        );
      }

      setConversations((currentConversations) =>
        currentConversations.filter(
          (conversation) =>
            conversation.id !==
            conversationIdToDelete
        )
      );

      if (
        conversationId ===
        conversationIdToDelete
      ) {
        handleNewConversation();
      }
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete conversation."
      );
    } finally {
      setDeletingConversationId(null);
    }
  }

  async function sendMessage(
    messageText: string
  ) {
    const trimmedInput =
      messageText.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    if (
      trimmedInput.length >
      MAX_MESSAGE_LENGTH
    ) {
      setError(
        `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
      );

      return;
    }

    setError("");

    setLastFailedMessage(null);

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }

    const isNewConversation =
      !conversationId;

    if (isNewConversation) {
      setConversationTitle(
        trimmedInput.slice(0, 50)
      );
    }

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedInput,
            conversationId,
          }),
        }
      );

      let data: {
        error?: string;
      } = {};

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            data.error ||
              "Gemini's free-tier limit has been reached. Please try again later."
          );
        }

        if (response.status === 503) {
          throw new Error(
            data.error ||
              "Gemini is temporarily busy. Please try again in a moment."
          );
        }

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        throw new Error(
          data.error ||
            "Something went wrong. Please try again."
        );
      }

      const responseConversationId =
        response.headers.get(
          "X-Conversation-Id"
        );

      if (responseConversationId) {
        setConversationId(
          responseConversationId
        );
      }

      if (!response.body) {
        throw new Error(
          "The server returned an empty response. Please try again."
        );
      }

      const assistantMessageId =
        Date.now() + 1;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]);

      const reader =
        response.body.getReader();

      const decoder = new TextDecoder();

      let assistantResponse = "";

      try {
        while (true) {
          const { done, value } =
            await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(
            value,
            {
              stream: true,
            }
          );

          assistantResponse += chunk;

          setMessages((currentMessages) =>
            currentMessages.map(
              (message) =>
                message.id ===
                assistantMessageId
                  ? {
                      ...message,
                      content:
                        assistantResponse,
                    }
                  : message
            )
          );
        }

        const finalChunk =
          decoder.decode();

        if (finalChunk) {
          assistantResponse +=
            finalChunk;

          setMessages((currentMessages) =>
            currentMessages.map(
              (message) =>
                message.id ===
                assistantMessageId
                  ? {
                      ...message,
                      content:
                        assistantResponse,
                    }
                  : message
            )
          );
        }
      } catch (streamError) {
        console.error(
          "Response stream error:",
          streamError
        );

        throw new Error(
          "The connection was interrupted while Gemini was responding. Please try again."
        );
      }

      if (!assistantResponse.trim()) {
        throw new Error(
          "Gemini returned an empty response. Please try again."
        );
      }

      await refreshConversations();
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      setLastFailedMessage(
        trimmedInput
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend(
    event?: FormEvent
  ) {
    event?.preventDefault();

    await sendMessage(input);
  }

  async function handleRetry() {
    if (
      !lastFailedMessage ||
      isLoading
    ) {
      return;
    }

    setIsRetrying(true);

    setError("");

    try {
      await sendMessage(
        lastFailedMessage
      );
    } finally {
      setIsRetrying(false);
    }
  }

  const conversationList = (
      <div className="mt-5 space-y-1.5">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-indigo-100 bg-white/60 px-4 py-4 text-sm text-slate-500">
            No conversations yet.
          </div>
        ) : (
          conversations.map(
            (conversation) => {
              const isEditing =
                editingConversationId ===
                conversation.id;

              const isDeleting =
                deletingConversationId ===
                conversation.id;

              return (
                <div
                  key={conversation.id}
                  className={`group rounded-2xl transition-all ${
                    conversation.id ===
                    conversationId
                      ? "bg-indigo-100/80 shadow-sm"
                      : "hover:bg-white/70"
                  }`}
                >
                  {isEditing ? (
                    <div className="p-2.5">
                      <input
                        ref={renameInputRef}
                        value={editingTitle}
                        onChange={(event) =>
                          setEditingTitle(
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();

                            handleRenameConversation(
                              conversation.id
                            );
                          }

                          if (
                            event.key ===
                            "Escape"
                          ) {
                            handleCancelRename();
                          }
                        }}
                        maxLength={
                          MAX_TITLE_LENGTH
                        }
                        disabled={isRenaming}
                        className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/60 disabled:opacity-60"
                      />

                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={
                            handleCancelRename
                          }
                          disabled={
                            isRenaming
                          }
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-white hover:text-slate-800 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRenameConversation(
                              conversation.id
                            )
                          }
                          disabled={
                            isRenaming
                          }
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {isRenaming
                            ? "Saving..."
                            : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          loadConversation(
                            conversation.id
                          )
                        }
                        className={`flex min-w-0 flex-1 items-start gap-3 rounded-2xl px-3.5 py-3 text-left text-sm transition-all ${
                          conversation.id ===
                          conversationId
                            ? "text-indigo-700"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            conversation.id ===
                            conversationId
                              ? "bg-white text-indigo-600"
                              : "bg-indigo-50 text-indigo-500 group-hover:bg-white"
                          }`}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-4.2-1L3 20l1.2-4.2A8.5 8.5 0 0 1 3 11.5a9 9 0 0 1 18 0Z" />
                          </svg>
                        </span>

                        <span className="min-w-0 flex-1 truncate pt-1 leading-5">
                          {conversation.title}
                        </span>
                      </button>

                      <div className="flex shrink-0 items-center gap-1 pr-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStartRename(
                              conversation
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-white hover:text-indigo-600 md:opacity-0 md:group-hover:opacity-100"
                          aria-label={`Rename ${conversation.title}`}
                          title="Rename conversation"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteConversation(
                              conversation.id
                            )
                          }
                          disabled={
                            isDeleting
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 md:opacity-0 md:group-hover:opacity-100"
                          aria-label={`Delete ${conversation.title}`}
                          title="Delete conversation"
                        >
                          {isDeleting ? (
                            <span className="text-xs">
                              ...
                            </span>
                          ) : (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="m19 6-1 14H6L5 6" />
                              <path d="M10 11v5M14 11v5" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          )
        )}
      </div>
  );

  const sidebarContent = (
      <>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 14.2 9.8 21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z" />
            </svg>
          </div>

          <div className="text-xl font-bold tracking-tight text-slate-900">
            Gemini
            <span className="text-indigo-600">
              Chat
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewConversation}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
        >
          <span className="text-lg leading-none">
            +
          </span>
          New conversation
        </button>

        <div className="mt-9">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Conversations
            </p>

            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              {conversations.length}
            </span>
          </div>

          {conversationList}
        </div>
      </>
  );

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f8ff] text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="relative z-20 hidden w-80 shrink-0 border-r border-indigo-100/80 bg-[#eef0ff] md:block">
        <div className="h-full overflow-y-auto px-5 py-6">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm md:hidden"
          onClick={() =>
            setIsMobileSidebarOpen(false)
          }
        >
          <aside
            className="h-full w-[85%] max-w-sm bg-[#eef0ff] px-5 py-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMobileSidebarOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Chat Area */}
      <section className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* Decorative Floating Bubbles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-200/60 blur-sm animate-[chatFloat_12s_ease-in-out_infinite]" />

          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-violet-200/65 blur-sm animate-[chatFloat_15s_ease-in-out_infinite]" />

          <div className="absolute right-[14%] top-[25%] h-28 w-28 rounded-full bg-blue-200/60 shadow-[0_0_45px_rgba(129,140,248,0.18)] animate-[chatFloat_10s_ease-in-out_infinite]" />

          <div className="absolute left-[44%] top-[18%] h-14 w-14 rounded-full bg-white/90 shadow-[0_0_35px_rgba(129,140,248,0.18)] animate-[chatFloat_8s_ease-in-out_infinite]" />

          <div className="absolute bottom-[12%] left-[8%] h-36 w-36 rounded-full bg-purple-200/55 blur-sm animate-[chatFloat_13s_ease-in-out_infinite]" />

          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-indigo-200/60 blur-sm animate-[chatFloat_16s_ease-in-out_infinite]" />

          <div className="absolute bottom-[20%] right-[22%] h-16 w-16 rounded-full bg-violet-200/60 shadow-[0_0_35px_rgba(129,140,248,0.16)] animate-[chatFloat_9s_ease-in-out_infinite]" />
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-white/70 bg-white/65 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsMobileSidebarOpen(true)
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-600 shadow-sm md:hidden"
                aria-label="Open conversations"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="min-w-0">
                <h1 className="truncate font-semibold text-slate-900">
                  {conversationTitle}
                </h1>

                <p className="text-sm text-slate-500">
                  Gemini AI Assistant
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-white hover:text-indigo-600"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Messages */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-full items-start gap-3 ${
                    message.role === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {message.role ===
                    "assistant" && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 shadow-sm ring-4 ring-white/50">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-3xl px-5 py-4 leading-7 shadow-sm ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white shadow-indigo-200/40"
                        : "border border-white/80 bg-white/90 text-slate-700 backdrop-blur-sm"
                    }`}
                  >
                    {message.content ? (
                      <ReactMarkdown
                        components={{
                          p: ({
                            children,
                          }) => (
                            <p className="mb-3 last:mb-0">
                              {children}
                            </p>
                          ),

                          ul: ({
                            children,
                          }) => (
                            <ul className="mb-3 list-disc space-y-1 pl-5">
                              {children}
                            </ul>
                          ),

                          ol: ({
                            children,
                          }) => (
                            <ol className="mb-3 list-decimal space-y-1 pl-5">
                              {children}
                            </ol>
                          ),

                          strong: ({
                            children,
                          }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),

                          code: ({
                            children,
                          }) => (
                            <code className="rounded-lg bg-indigo-50 px-1.5 py-0.5 text-sm text-indigo-700">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="flex items-center gap-2 py-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                      </div>
                    )}

                    {message.role ===
                      "assistant" &&
                      message.content && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyMessage(
                              message.id,
                              message.content
                            )
                          }
                          className="mt-3 text-xs font-medium text-slate-400 transition-colors hover:text-indigo-600"
                        >
                          {copiedMessageId ===
                          message.id
                            ? "Copied!"
                            : "Copy"}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-4 text-sm text-red-600 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p>{error}</p>

                  {lastFailedMessage &&
                    !isLoading && (
                      <button
                        type="button"
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRetrying
                          ? "Retrying..."
                          : "Retry"}
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="relative z-10 border-t border-white/80 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-8 sm:py-5">
          <form
            onSubmit={handleSend}
            className="mx-auto flex max-w-5xl items-end gap-3"
          >
            <div className="min-w-0 flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(
                    event.target.value
                  );

                  event.target.style.height =
                    "auto";

                  event.target.style.height = `${event.target.scrollHeight}px`;
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    handleSend();
                  }
                }}
                placeholder="Ask Gemini anything..."
                disabled={isLoading}
                maxLength={
                  MAX_MESSAGE_LENGTH
                }
                rows={1}
                className="max-h-40 min-h-12 w-full resize-none overflow-y-auto rounded-2xl border border-indigo-100 bg-white/90 px-4 py-3 text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1.5 px-1 text-xs text-slate-400">
                {input.length}/
                {MAX_MESSAGE_LENGTH}
              </p>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !input.trim()
              }
              className="mb-5 shrink-0 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading
                ? "Generating..."
                : "Send"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}