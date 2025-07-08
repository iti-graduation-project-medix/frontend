import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Package,
  User2,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
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
import DealInfoBar from "../../components/ui/chat/DealInfoBar";
import { Link } from "react-router-dom";
import { leaveRoom } from "../../services/socket";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("list"); // 'list' or 'chat'

  // Responsive: on mobile, widget is full width, bottom 90% height
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Responsive widget size
  const widgetWidth = "w-full max-w-[400px]";
  const widgetHeight = "h-[70vh] max-h-[600px]";

  const { user, isAuthenticated } = useAuth();
  const {
    activeChat,
    chats,
    messages,
    loading,
    error,
    startChat,
    sendMessage,
    loadUserChats,
    selectChat,
    clearError,
    initializeSocket,
    getCurrentUserId,
    socket,
    isWidgetOpen,
    setIsWidgetOpen,
  } = useChat();

  const unreadCount = useChat((state) => state.totalUnreadCount);
  const prevUnreadRef = useRef(unreadCount);

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      const audio = new window.Audio("/new-notification-07-210334.mp3");
      audio.play();
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  // Leave all chat rooms when widget closes or on unmount
  useEffect(() => {
    // No longer leaving rooms on widget close or unmount
  }, []);

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

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-700 text-lg font-bold">
        Please login to access chat
      </div>
    );
  }

  // Animation variants
  const floatingButtonVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      rotate: -2,
    },
  };

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
    <motion.button
      onClick={() => setIsWidgetOpen(true)}
      className="fixed z-50 bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all"
      aria-label="Open Chat"
      variants={floatingButtonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <MessageCircle className="w-7 h-7" />
      {unreadCount > 0 && (
        <motion.span
          className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-lg font-semibold"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: 0.1,
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </motion.span>
      )}
    </motion.button>
  );

  // Layout: only one view at a time
  const chatContent = (
    <div className="flex flex-col h-full w-full">
      {mode === "list" && (
        <div className="flex flex-col h-full w-full">
          {/* Chat List Sidebar (full widget area) */}
          <div className="p-6 border-b border-gray-200/50 bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                  <p className="text-sm text-gray-500">
                    Chat with buyers & sellers
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-50/80 border-gray-200/50 focus:bg-white focus:border-blue-300 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/80 shadow animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
                      <div className="h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
                    </div>
                  </div>
                ))}
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
            ) : chats.length > 0 ? (
              <div className="p-2">
                {chats.map((chat) => {
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
                    <motion.div
                      key={chat.roomId}
                      onClick={() => handleChatSelect(chat)}
                      className="p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50/80 bg-white shadow border border-gray-100 mb-2 hover:border-cyan-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage
                            src={chat.otherUser?.profilePhotoUrl}
                            alt={chat.otherUser?.fullName}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                            {chat.otherUser?.fullName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {chat.otherUser?.fullName || "Unknown User"}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {lastMsgTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage?.text || "No messages yet"}
                              </p>
                              {chat.deal && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Package className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 truncate">
                                    {chat.deal.title || "Deal"}
                                  </span>
                                </div>
                              )}
                            </div>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-1 ml-2">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start a chat by clicking "Chat with me" on any deal or
                  pharmacy listing
                </p>
                <Button
                  onClick={() => window.history.back()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Browse Listings
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {mode === "chat" && (
        <div className="flex flex-col h-full w-full">
          {/* Back button and header (compact, all in one row) */}
          <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200/50 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 ring-2 ring-white shadow-lg">
              <AvatarImage
                src={activeChat.otherUser?.profilePhotoUrl}
                alt={activeChat.otherUser?.fullName}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                {activeChat.otherUser?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-base truncate">
                  {activeChat.otherUser?.fullName || "Unknown User"}
                </span>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>
            <Link
              to={`/profile/${activeChat.otherUser?.id}`}
              className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 hover:bg-blue-200 transition"
            >
              <User2 className="w-4 h-4" />
              Profile
            </Link>
          </div>
          {/* Deal Info Banner (compact, collapsible) */}
          {activeChat?.deal && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100 text-sm shrink-0">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-900 truncate flex-1">
                {activeChat.deal.medicineName ||
                  activeChat.deal.title ||
                  "Deal"}
              </span>
              <Link
                to={`/all-deals/${activeChat.deal.id}`}
                className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
              >
                View
              </Link>
              {/* Collapsible toggle (optional, can add details on click) */}
            </div>
          )}
          {/* Main Chat Area: messages and input */}
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Messages (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-2 pt-2 pb-1">
              <ChatMessageList className="h-full">
                {currentMessages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    variant={msg.isOwn ? "sent" : "received"}
                  >
                    {!msg.isOwn && (
                      <ChatBubbleAvatar
                        src={msg.avatar}
                        fallback={msg.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      />
                    )}
                    <ChatBubbleMessage
                      variant={msg.isOwn ? "sent" : "received"}
                      className={
                        msg.isOwn
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-white shadow-md border border-gray-100"
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
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </ChatBubble>
                ))}
              </ChatMessageList>
            </div>
            {/* Input (always visible at bottom) */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-3 shrink-0">
              <div className="flex items-end gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 shrink-0"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <ChatInput
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[40px] max-h-32 bg-gray-50/80 border-gray-200/50 focus:bg-white focus:border-blue-300 transition-all resize-none w-full"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Responsive: on mobile, widget is full width, bottom 90% height
  const mobileWidgetStyle = isMobile
    ? {
        width: "100vw",
        right: 0,
        left: 0,
        bottom: 0,
        height: "90vh",
        borderRadius: 0,
      }
    : {};

  // Floating chat widget with animations
  const FloatingWidget = (
    <motion.div
      className={
        `fixed z-50 bottom-0 left-0 ` +
        `flex flex-col ` +
        `bg-white ` +
        `overflow-hidden ` +
        `w-screen h-[90vh] rounded-none border-0 shadow-none ` +
        `sm:bottom-6 sm:left-6 sm:w-full sm:max-w-[400px] sm:h-[70vh] sm:max-h-[600px] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-blue-100`
      }
      variants={widgetVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 sm:p-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-7 h-7 sm:w-6 sm:h-6" />
          <span className="font-bold text-lg">Chat</span>
        </div>
        <motion.button
          onClick={() => setIsWidgetOpen(false)}
          className="p-2 sm:p-1 rounded hover:bg-blue-700 transition"
          aria-label="Close Chat"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
      {/* Main chat content */}
      <div className="flex flex-col flex-1 min-h-0 w-full">{chatContent}</div>
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
                className="fixed inset-0 bg-black/20 z-40"
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
