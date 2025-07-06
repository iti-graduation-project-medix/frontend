import React, { useState, useEffect } from "react";
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

export default function Chat() {
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
  } = useChat();

  // Initialize socket and load chats on component mount
  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
      loadUserChats();
    }
  }, [isAuthenticated, initializeSocket, loadUserChats]);

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

  const handleChatSelect = async (chat) => {
    try {
      await selectChat(chat);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  const currentMessages = activeChat ? messages[activeChat.roomId] || [] : [];

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-700 text-lg font-bold">
        Please login to access chat
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex  rounded-lg">
      {/* Chat List Sidebar */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex w-full md:w-96 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex-col `}
      >
        {/* Header */}
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

        {/* Chat List */}
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
                    // Same day: show time
                    lastMsgTime = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } else {
                    // Different day: show date
                    lastMsgTime = date.toLocaleDateString();
                  }
                }
                return (
                  <div
                    key={chat.roomId}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50/80 ${
                      activeChat?.roomId === chat.roomId
                        ? "bg-blue-50/80 border border-blue-200"
                        : ""
                    }`}
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
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage?.text || "No messages yet"}
                          </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                              {chat.unreadCount}
                            </Badge>
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
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start a chat by clicking "Chat with me" on any deal or pharmacy
                listing
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

      {/* Main Chat Area */}
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } md:flex flex-1 flex-col bg-white/60 backdrop-blur-sm`}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gray-100"
                  onClick={() => setShowSidebar(true)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
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
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {activeChat.otherUser?.fullName || "Unknown User"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700"
                    >
                      {activeChat.otherUser?.role || "User"}
                    </Badge>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-sm text-red-600 hover:text-red-500 mt-1"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-transparent to-gray-50/30">
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

            {/* Message Input */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6 ">
              <div className="flex items-end gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <ChatInput
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] max-h-32 bg-gray-50/80 border-gray-200/50 focus:bg-white focus:border-blue-300 transition-all resize-none"
                  />
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Empty state when no chat is selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Start a chat by clicking "Chat with me" on any deal or pharmacy
                listing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
