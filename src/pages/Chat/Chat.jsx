import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  ArrowLeft,
  MessageCircle,
  Check,
  CheckCheck,
  Package,
  User2,
  X,
  Building2,
  MessagesSquare,
  Lock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "../../components/ui/chat/chat-bubble.jsx";
import { ChatMessageList } from "../../components/ui/chat/chat-message-list.jsx";
import { ChatInput } from "../../components/ui/chat/chat-input.jsx";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";
import { Link } from "react-router-dom";
import { leaveRoom } from "../../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import { getUserDetails } from "../../api/profile/UserDetails";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("list"); // 'list' or 'chat'
  const [activeTab, setActiveTab] = useState("open"); // 'open' or 'closed'

  // Filter toggles for chat type
  const [showDeals, setShowDeals] = useState(true);
  const [showPharmacies, setShowPharmacies] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Responsive widget size
  const widgetWidth = "w-full max-w-[400px]";
  const widgetHeight = isMobile ? "h-screen" : "h-[70vh] max-h-[600px]";

  const { user, isAuthenticated } = useAuth();
  const {
    activeChat,
    chats,
    messages,
    loading,
    sendMessage,
    selectChat,
    getCurrentUserId,
    isWidgetOpen,
    setIsWidgetOpen,
    isRoomClosed,
    error,
    clearError,
  } = useChat();

  // Filter chats based on active tab and toggles
  const openChats = chats.filter((chat) => !chat.isClosed);
  const closedChats = chats.filter((chat) => chat.isClosed);
  let currentChats = activeTab === "open" ? openChats : closedChats;
  currentChats = currentChats.filter(
    (chat) => (showDeals && chat.deal) || (showPharmacies && chat.pharmacy)
  );

  const unreadCount = useChat((state) => state.totalUnreadCount);
  const prevUnreadRef = useRef(unreadCount);
  const messageListRef = useRef();
  const prevUnreadCountsRef = useRef({});

  // Always show chat list when widget is opened
  useEffect(() => {
    if (isWidgetOpen) {
      setMode("list");
    }
  }, [isWidgetOpen]);

  // Auto-switch to closed tab when a chat gets closed
  useEffect(() => {
    if (isRoomClosed && activeChat) {
      // Switch to closed tab after a short delay to show the transition
      const timer = setTimeout(() => {
        setActiveTab("closed");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRoomClosed, activeChat]);

  useEffect(() => {
    // Only play sound if a room (not the active one) gets more unread
    if (chats && chats.length > 0) {
      for (const chat of chats) {
        const prev = prevUnreadCountsRef.current[chat.roomId] || 0;
        if (
          chat.unreadCount > prev &&
          (!activeChat || chat.roomId !== activeChat.roomId)
        ) {
          const audio = new window.Audio("/new-notification-07-210334.mp3");
          audio.play();
          break; // Only play once per update
        }
      }
      // Update ref after check
      prevUnreadCountsRef.current = Object.fromEntries(
        chats.map((c) => [c.roomId, c.unreadCount])
      );
    }
  }, [chats, activeChat?.roomId]);

  // Leave all chat rooms when widget closes or on unmount
  useEffect(() => {
    // No longer leaving rooms on widget close or unmount
  }, []);

  useEffect(() => {
    if (!isWidgetOpen) {
      // Reset room closed state when widget closes
      if (isRoomClosed) {
        clearError();
      }
    }
  }, [isWidgetOpen, isRoomClosed, clearError]);

  // Handle mobile viewport for chat widget
  useEffect(() => {
    if (isMobile && isWidgetOpen) {
      // Set viewport height for mobile
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      // Prevent background scroll when chat is open
      document.body.style.overflow = "hidden";

      return () => {
        document.documentElement.style.removeProperty("--vh");
        document.body.style.overflow = "";
      };
    }
    // Also restore scroll if chat closes (desktop or mobile)
    if (!isWidgetOpen) {
      document.body.style.overflow = "";
    }
  }, [isMobile, isWidgetOpen]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // When a chat is selected, switch to chat mode
  const handleChatSelect = async (chat) => {
    try {
      await selectChat(chat);
      setMode("chat");
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  // Back button handler
  const handleBackToList = () => {
    // Leave the current room when going back to the list
    const userId = getCurrentUserId();
    if (activeChat && activeChat.roomId && userId) {
      leaveRoom(activeChat.roomId, userId);
    }
    setMode("list");
  };

  const currentMessages = activeChat ? messages[activeChat.roomId] || [] : [];

  // Scroll to bottom when chat opens or messages change
  useEffect(() => {
    if (mode === "chat" && messageListRef.current) {
      const el = messageListRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [mode, currentMessages.length, activeChat?.roomId]);

  // Add this effect after activeChat and messages are defined
  useEffect(() => {
    async function updateReceiverProfilePhoto() {
      if (!activeChat || !activeChat.otherUser?.id) return;
      try {
        const userDetails = await getUserDetails(activeChat.otherUser.id);
        const newPhotoUrl = userDetails?.profilePhotoUrl || userDetails?.avatar;
        if (
          newPhotoUrl &&
          newPhotoUrl !== activeChat.otherUser.profilePhotoUrl
        ) {
          // Update the activeChat in the chat store
          // If you have a setActiveChat or updateActiveChat method, use it. Otherwise, update in place:
          useChat.setState((state) => ({
            activeChat: {
              ...state.activeChat,
              otherUser: {
                ...state.activeChat.otherUser,
                profilePhotoUrl: newPhotoUrl,
              },
            },
          }));
        }
      } catch (error) {
        // Optionally handle error
      }
    }
    updateReceiverProfilePhoto();
    // eslint-disable-next-line
  }, [activeChat, messages[activeChat?.roomId]?.length]);

  if (!isAuthenticated) {
    return <></>;
  }

  const widgetVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      x: isMobile ? 0 : -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      x: isMobile ? 0 : -20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Floating button with animation
  const FloatingButton = (
    <div className="fixed bottom-6 left-6 z-50 sm:left-6 ">
      <button
        onClick={() => setIsWidgetOpen(true)}
        className="group relative cursor-pointer"
        aria-label="Open Chat"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-hover opacity-80 group-hover:opacity-100 animate-pulse blur-lg transition-all duration-300"></div>
        {/* Main button */}
        <div className="relative w-15 h-15 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:shadow-primary/40 transition-all duration-500 group-hover:scale-110 flex items-center justify-center">
          {/* Lucide MessageCircle icon, styled */}
          <MessagesSquare className="w-8 h-8 text-white font-bold drop-shadow-md" />
        </div>
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md animate-pulse border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>
    </div>
  );

  // Layout: only one view at a time
  const chatContent = (
    <div className="flex flex-col h-full w-full">
      {mode === "list" && (
        <div className="flex flex-col h-full w-full relative overflow-hidden">
          {/* Tab Interface */}
          <div className="flex items-center justify-center p-4 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-background dark:to-background">
            <div className="flex bg-white dark:bg-card rounded-xl p-1 shadow-lg border border-border dark:border-border">
              <button
                onClick={() => setActiveTab("open")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "open"
                    ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-md dark:from-primary dark:to-primary-hover dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted/10"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Open Chats ({openChats.length})
              </button>
              <button
                onClick={() => setActiveTab("closed")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "closed"
                    ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-md dark:from-primary dark:to-primary-hover dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted/10"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                Closed Chats ({closedChats.length})
              </button>
            </div>
          </div>
          {/* Filter Icons - centered */}
          <div className="flex justify-center items-center mt-2 gap-2 z-10">
            <button
              onClick={() => setShowDeals((v) => !v)}
              className={`p-1 rounded-full border transition-all duration-200 focus:outline-none ${
                showDeals
                  ? "bg-primary/10 dark:bg-primary/20 border-primary text-primary shadow"
                  : "bg-white dark:bg-card border-gray-200 dark:border-border text-gray-400 opacity-60"
              }`}
              title={showDeals ? "Hide Deal Chats" : "Show Deal Chats"}
              aria-label="Toggle Deal Chats"
              type="button"
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowPharmacies((v) => !v)}
              className={`p-1 rounded-full border transition-all duration-200 focus:outline-none ${
                showPharmacies
                  ? "bg-primary/10 dark:bg-primary/20 border-primary text-primary shadow"
                  : "bg-white dark:bg-card border-gray-200 dark:border-border text-gray-400 opacity-60"
              }`}
              title={
                showPharmacies ? "Hide Pharmacy Chats" : "Show Pharmacy Chats"
              }
              aria-label="Toggle Pharmacy Chats"
              type="button"
            >
              <Building2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col gap-2 px-2 pt-2 pb-1">
                {[...Array(9)].map((_, i) => {
                  // Vary width and height for realism
                  const bubbleWidth = Math.floor(Math.random() * 80) + 100; // 100-180px
                  const bubbleHeight = Math.random() > 0.7 ? 18 : 12; // Some taller
                  const isSent = i % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isSent ? "justify-end" : "justify-start"
                      } w-full relative`}
                      style={{ top: i * 2 }}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[70%] ${
                          isSent ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar for received */}
                        {!isSent && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shimmer shadow" />
                        )}
                        {/* Message bubble skeleton */}
                        <div
                          className={`rounded-2xl shadow ${
                            isSent
                              ? "bg-gradient-to-r from-primary/20 to-primary/10"
                              : "bg-white/80 border border-gray-200"
                          } shimmer`}
                          style={{
                            width: bubbleWidth,
                            height: bubbleHeight + 16,
                          }}
                        ></div>
                      </div>
                      {/* Timestamp skeleton */}
                      <div className="w-8 h-3 rounded bg-gray-100 ml-2 shimmer" />
                    </div>
                  );
                })}
                <style>{`
                .shimmer {
                  background-size: 200% 100%;
                  animation: shimmer 1.5s infinite linear;
                }
                @keyframes shimmer {
                  0% { background-position: -200% 0; }
                  100% { background-position: 200% 0; }
                }
              `}</style>
              </div>
            ) : currentChats.length > 0 ? (
              <div className="space-y-3">
                {currentChats.map((chat, index) => {
                  // Format last message time
                  let lastMsgTime = "";
                  if (chat.lastMessage?.sentAt) {
                    const date = new Date(chat.lastMessage.sentAt);
                    const now = new Date();
                    if (
                      date.getDate() === now.getDate() &&
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    ) {
                      lastMsgTime = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    } else {
                      lastMsgTime = date.toLocaleDateString();
                    }
                  }
                  return (
                    <div
                      key={chat.roomId}
                      onClick={() => handleChatSelect(chat)}
                      className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                      style={{
                        animation: `slideInUp 0.5s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-blue-100/10 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                        {/* Main chat item */}
                        <div
                          className={`relative backdrop-blur-xl rounded-2xl p-4 border border-border dark:border-border shadow-xl transition-all duration-300 ${
                            chat.isClosed
                              ? "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
                              : "bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-50 dark:from-background dark:via-card dark:to-background group-hover:border-primary dark:group-hover:border-primary"
                          }`}
                        >
                          {/* Closed indicator */}
                          {chat.isClosed && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full">
                              <Lock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500 font-medium">
                                Closed
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            {/* Avatar with status */}
                            <div className="relative">
                              <div
                                className={`w-12 h-12 rounded-2xl p-0.5 shadow-lg ${
                                  chat.isClosed
                                    ? "bg-gradient-to-br from-gray-200 to-gray-300"
                                    : "bg-gradient-to-br from-blue-100 to-indigo-100"
                                }`}
                              >
                                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                                  <span className="text-primary font-bold text-lg">
                                    {chat.otherUser?.fullName
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "U"}
                                  </span>
                                </div>
                              </div>
                              {/* Online status */}
                              {!chat.isClosed && (
                                <div
                                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-lg ${
                                    chat.otherUser?.isOnline
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  {chat.otherUser?.isOnline && (
                                    <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* Chat info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                                  {chat.otherUser?.fullName || "Unknown User"}
                                </h3>
                                {!chat.isClosed && (
                                  <span className="text-xs text-muted-foreground">
                                    {lastMsgTime}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate opacity-80">
                                {chat.lastMessage?.text || "No messages yet"}
                              </p>
                              {/* Deal or Pharmacy label */}
                              {chat.deal && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Package className="w-4 h-4 text-primary" />
                                  <span className="text-xs text-primary font-medium">
                                    {chat.deal.medicineName ||
                                      chat.deal.title ||
                                      "Deal"}
                                  </span>
                                </div>
                              )}
                              {chat.pharmacy && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  <span className="text-xs text-primary font-medium">
                                    {chat.pharmacy.name || "Pharmacy"}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Unread badge */}
                            {chat.unreadCount > 0 && (
                              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessagesSquare className="h-9 w-9 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold  mb-2">
                  {activeTab === "open"
                    ? "No open conversations"
                    : "No closed conversations"}
                </h3>
                <p className=" mb-4">
                  {!showDeals && !showPharmacies
                    ? "Please select at least one filter (Deals or Pharmacies) to view chats"
                    : activeTab === "open"
                    ? `No ${
                        showDeals && showPharmacies
                          ? ""
                          : showDeals
                          ? "deal "
                          : "pharmacy "
                      }conversations found. Start a chat by clicking "Chat with me" on any ${
                        showDeals && showPharmacies
                          ? "deal or pharmacy"
                          : showDeals
                          ? "deal"
                          : "pharmacy"
                      } listing`
                    : `No ${
                        showDeals && showPharmacies
                          ? ""
                          : showDeals
                          ? "deal "
                          : "pharmacy "
                      }conversations found. Closed chats will appear here when ${
                        showDeals && showPharmacies
                          ? "deals or pharmacies"
                          : showDeals
                          ? "deals"
                          : "pharmacies"
                      } are no longer available`}
                </p>
              </div>
            )}
          </div>
          <style>{`
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
      {mode === "chat" && (
        <div className="flex flex-col h-full w-full">
          {/* Back button and header (compact, all in one row) */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 dark:from-background dark:via-card dark:to-background border-b border-border dark:border-border shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="hover:bg-blue-50 dark:hover:bg-muted/10 text-foreground dark:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 ring-2 ring-white shadow-lg">
              <AvatarImage
                src={activeChat.otherUser?.profilePhotoUrl}
                alt={activeChat.otherUser?.fullName}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-primary/20 dark:to-primary/10 text-foreground font-semibold">
                {activeChat.otherUser?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0"></div>
            <Link
              to={`/pharmacists/${activeChat.otherUser?.id}`}
              onClick={() => {
                if (isMobile) setIsWidgetOpen(false);
              }}
              className="px-2 py-1 rounded bg-blue-100 dark:bg-primary/20 text-foreground dark:text-foreground text-xs font-semibold flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-primary/30 transition"
            >
              <User2 className="w-4 h-4" />
              Profile
            </Link>
          </div>
          {/* Pharmacy Info Banner (like DealInfoBar) */}
          {activeChat?.pharmacy && (
            <div className="px-4 py-2 shadow-xl">
              <div className="bg-gradient-to-r from-blue-50/60 to-indigo-100/60 dark:from-background/80 dark:to-card/80 rounded-2xl p-3 border border-blue-100 dark:border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-primary/20 dark:to-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground dark:text-foreground truncate">
                      {activeChat.pharmacy.name || "Pharmacy"}
                    </h4>
                    {activeChat.pharmacy.city && (
                      <p className="text-xs text-primary truncate">
                        {activeChat.pharmacy.city}
                      </p>
                    )}
                  </div>
                  {!isRoomClosed && (
                    <Link
                      to={`/pharmacies/${activeChat.pharmacy.id}`}
                      onClick={() => {
                        if (isMobile) setIsWidgetOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-primary-hover text-white hover:from-primary-hover hover:to-primary dark:hover:from-primary-hover dark:hover:to-primary"
                    >
                      View Pharmacy
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Deal Info Banner (modern glassy style) */}
          {activeChat?.deal && (
            <div className="px-4 py-2 shadow-xl">
              <div className="bg-gradient-to-r from-blue-50/60 to-indigo-100/60 dark:from-background/80 dark:to-card/80 rounded-2xl p-3 border border-blue-100 dark:border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-primary/20 dark:to-primary/10 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground dark:text-foreground">
                      {activeChat.deal.medicineName ||
                        activeChat.deal.title ||
                        "Deal"}
                    </h4>
                    {activeChat.deal.price && (
                      <p className="text-sm text-primary">
                        EGP{Number(activeChat.deal.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                  {!isRoomClosed && (
                    <Link
                      to={`/deals/${activeChat.deal.id}`}
                      onClick={() => {
                        if (isMobile) setIsWidgetOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-primary-hover dark:from-primary dark:to-primary-hover text-white hover:from-primary-hover hover:to-primary dark:hover:from-primary-hover dark:hover:to-primary"
                    >
                      View Deal
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Main Chat Area: messages and input */}
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Messages (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-2 pt-2 pb-1 custom-scrollbar">
              <ChatMessageList className="h-full" ref={messageListRef}>
                {currentMessages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    variant={msg.isOwn ? "sent" : "received"}
                  >
                    <ChatBubbleMessage
                      variant={msg.isOwn ? "sent" : "received"}
                      className={
                        (msg.isOwn
                          ? "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg"
                          : "bg-white shadow-md border border-gray-100 text-foreground") +
                        " break-words whitespace-pre-line max-w-[75%]"
                      }
                    >
                      {msg.content}
                    </ChatBubbleMessage>
                    <div className="flex items-center gap-1 mt-1">
                      <ChatBubbleTimestamp timestamp={msg.timestamp} />
                      {msg.isOwn && (
                        <div className="flex items-center">
                          {msg.status === "sent" && (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                          {msg.status === "read" && (
                            <CheckCheck className="w-3 h-3 text-primary" />
                          )}
                        </div>
                      )}
                    </div>
                  </ChatBubble>
                ))}
              </ChatMessageList>
            </div>
            {/* Input (always visible at bottom) */}
            <div
              className={`bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-background dark:via-card dark:to-background border-t border-border dark:border-border p-3 shrink-0 ${
                isMobile ? "pb-safe" : ""
              }`}
            >
              {/* In chat mode, disable input and show message if room is closed */}
              {isRoomClosed ? (
                <div
                  className="flex flex-col items-center justify-center py-1  max-w-xs mx-auto"
                  style={{ minHeight: "unset" }}
                >
                  <Lock className="w-6 h-6 text-primary mb-1" />
                  <div className="text-base font-semibold text-primary mb-0.5">
                    Chat Closed
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 text-center">
                    This chat is no longer available.
                    <br />
                    You can view previous messages, but cannot send new ones.
                  </div>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <Button
                    size="icon"
                    disabled={isRoomClosed}
                    className={`mb-3 shrink-0 rounded-2xl transition-all duration-200 ${
                      isRoomClosed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg hover:from-primary-hover hover:to-primary"
                    }`}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <ChatInput
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`min-h-[40px] max-h-32 bg-white border border-border text-foreground placeholder-muted-foreground focus:bg-blue-50 focus:border-primary transition-all resize-none w-full backdrop-blur-md rounded-2xl ${
                        isMobile ? "text-base" : ""
                      }`}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || loading || isRoomClosed}
                    className={`mb-3 shrink-0 rounded-2xl transition-all duration-200 ${
                      isRoomClosed || !message.trim() || loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg hover:from-primary-hover hover:to-primary"
                    }`}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Error display
  const errorDisplay = error ? (
    <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm font-semibold text-center">
      {error}
    </div>
  ) : null;

  // Responsive: on mobile, widget is full screen, on desktop it's floating
  const mobileWidgetStyle = isMobile
    ? {
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)", // Use CSS custom property for mobile
        right: 0,
        left: 0,
        bottom: 0,
        top: 0,
        borderRadius: 0,
      }
    : {};

  // Floating chat widget with animations
  const FloatingWidget = (
    <motion.div
      className={
        isMobile
          ? "fixed inset-0 z-[9999] flex flex-col bg-white/90 dark:bg-background/95 backdrop-blur-2xl overflow-hidden w-screen h-dvh rounded-none border-0 shadow-none"
          : "fixed z-50 bottom-6 left-6 flex flex-col bg-white/90 dark:bg-background/95 backdrop-blur-2xl overflow-hidden w-full max-w-[400px] h-[70vh] max-h-[600px] rounded-3xl shadow-2xl border border-border dark:border-border"
      }
      style={mobileWidgetStyle}
      variants={widgetVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-background dark:via-card dark:to-background">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 dark:from-primary/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-indigo-100/30 dark:from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-100/20 dark:from-primary/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 sm:p-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-50 dark:from-background dark:via-card dark:to-background border-b border-border dark:border-border text-foreground dark:text-foreground relative z-10">
        <div className="flex items-center gap-2">
          <MessagesSquare className="w-7 h-7 sm:w-6 sm:h-6" />
          <span className="font-bold text-lg">Chat</span>
        </div>
        <motion.button
          onClick={() => {
            // Leave the current room when closing the widget
            const userId = getCurrentUserId();
            if (activeChat && activeChat.roomId && userId) {
              leaveRoom(activeChat.roomId, userId);
            }
            setIsWidgetOpen(false);
          }}
          className="p-2 sm:p-1 rounded-xl bg-blue-50 dark:bg-card hover:bg-blue-100 dark:hover:bg-muted/10 transition text-foreground dark:text-foreground cursor-pointer"
          aria-label="Close Chat"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
      {/* Main chat content */}
      <div className="flex flex-col flex-1 min-h-0 w-full relative z-10">
        {chatContent}
      </div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {!isWidgetOpen && FloatingButton}
        {isWidgetOpen && (
          <>
            {/* Mobile overlay */}
            {isMobile && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-[9999]"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsWidgetOpen(false)}
              />
            )}
            {/* Widget */}
            <div style={mobileWidgetStyle}>{FloatingWidget}</div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
