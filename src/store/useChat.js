import { create } from "zustand";
import { getSocket, startChat, sendMessage } from "../services/socket";
import {
  getChatHistory,
  getOrCreateChatRoom,
  getUserChats,
} from "../services/chatApi";

const useChat = create((set, get) => ({
  // State
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,
  error: null,
  socket: null,

  // Actions
  initializeSocket: () => {
    const socket = getSocket();
    set({ socket });

    // Remove previous listeners to prevent duplicates
    socket.off("newMessage");
    socket.off("chatRoom");
    socket.off("error");

    // Listen for new messages
    socket.on("newMessage", (message) => {
      console.log("Received new message:", message);
      const { activeChat, chats } = get();

      // Update messages in active chat
      if (activeChat) {
        const currentUserId = (() => {
          try {
            return JSON.parse(localStorage.getItem("user"));
          } catch {
            return null;
          }
        })();

        set((state) => {
          const msgs = state.messages[activeChat.roomId] || [];
          // If the last message is optimistic and matches, replace it
          if (
            msgs.length &&
            msgs[msgs.length - 1].temp &&
            msgs[msgs.length - 1].content === message.text &&
            msgs[msgs.length - 1].senderId === message.senderId
          ) {
            // Replace the optimistic message with the real one
            return {
              ...state,
              messages: {
                ...state.messages,
                [activeChat.roomId]: [
                  ...msgs.slice(0, -1),
                  {
                    id: Date.now().toString(),
                    content: message.text,
                    timestamp: new Date(message.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    sender: message.senderName || "Unknown",
                    senderId: message.senderId,
                    isOwn: message.senderId === currentUserId,
                    status: "received",
                  },
                ],
              },
            };
          }
          // Otherwise, just add the message
          return {
            ...state,
            messages: {
              ...state.messages,
              [activeChat.roomId]: [
                ...msgs,
                {
                  id: Date.now().toString(),
                  content: message.text,
                  timestamp: new Date(message.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  sender: message.senderName || "Unknown",
                  senderId: message.senderId,
                  isOwn: message.senderId === currentUserId,
                  status: "received",
                },
              ],
            },
          };
        });
      }

      // Update chat list with new message (if we have an active chat)
      if (activeChat) {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.roomId === activeChat.roomId
              ? {
                  ...chat,
                  lastMessage: {
                    text: message.text,
                    sentAt: message.sentAt,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : chat
          ),
        }));
      }
    });

    // Listen for chat room creation/joining
    socket.on("chatRoom", async ({ roomId }) => {
      console.log("Joined chat room:", roomId);
      const { activeChat } = get();
      if (activeChat) {
        try {
          const messages = await getChatHistory(roomId);
          const currentUserId = (() => {
            try {
              return JSON.parse(localStorage.getItem("user"));
            } catch {
              return null;
            }
          })();

          // Mark messages as own if sent by current user
          const processedMessages = messages.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === currentUserId,
          }));

          set((state) => ({
            messages: {
              ...state.messages,
              [roomId]: processedMessages,
            },
            activeChat: {
              ...state.activeChat,
              roomId,
            },
          }));
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      set({ error: error.message });
    });
  },

  startChat: async (user1Id, user2Id, otherUserInfo) => {
    set({ loading: true, error: null });

    try {
      // Create or get chat room
      const roomId = await getOrCreateChatRoom(user1Id, user2Id);

      // Initialize socket if not already done
      if (!get().socket) {
        get().initializeSocket();
      }

      // Start chat via WebSocket
      startChat(user1Id, user2Id);

      // Set active chat
      const activeChat = {
        roomId,
        user1Id,
        user2Id,
        otherUser: otherUserInfo,
      };

      set({ activeChat, loading: false });

      return roomId;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  sendMessage: async (text) => {
    const { activeChat, socket } = get();
    if (!activeChat || !text.trim()) return;

    const currentUserId = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "You",
      senderId: currentUserId,
      isOwn: true,
      status: "sent",
      temp: true, // mark as optimistic
    };

    // Optimistically add message to UI
    set((state) => ({
      messages: {
        ...state.messages,
        [activeChat.roomId]: [
          ...(state.messages[activeChat.roomId] || []),
          newMessage,
        ],
      },
    }));

    // Send via WebSocket
    console.log("Sending message via WebSocket:", {
      roomId: activeChat.roomId,
      senderId: currentUserId,
      text: text.trim(),
    });
    sendMessage(activeChat.roomId, currentUserId, text.trim());
  },

  loadUserChats: async () => {
    set({ loading: true, error: null });

    try {
      const currentUserId = (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const chatRooms = await getUserChats(currentUserId);

      console.log("Raw chat rooms from backend:", chatRooms);

      // Transform the chat rooms data for the UI
      const transformedChats = chatRooms.map((room) => {
        // Determine the other user (not the current user)
        const otherUser =
          room.sender.id === currentUserId ? room.reciver : room.sender;

        return {
          roomId: room.id,
          user1Id: room.sender.id,
          user2Id: room.reciver.id,
          otherUser: {
            id: otherUser.id,
            fullName: otherUser.fullName || otherUser.name || "Unknown User",
            profilePhotoUrl: otherUser.profilePhotoUrl || otherUser.avatar,
            role: otherUser.role || "User",
          },
          lastMessage: room.lastMessage || null,
          unreadCount: room.unreadCount || 0,
          updatedAt: room.updatedAt || room.createdAt,
        };
      });

      set({ chats: transformedChats, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error loading user chats:", error);
    }
  },

  selectChat: async (chat) => {
    set({ loading: true, error: null });

    try {
      // Initialize socket if not already done
      if (!get().socket) {
        get().initializeSocket();
      }

      // Join the chat room via WebSocket
      const socket = get().socket;
      socket.emit("startChat", {
        user1Id: chat.user1Id,
        user2Id: chat.user2Id,
      });

      // Load chat history
      const messages = await getChatHistory(chat.roomId);
      const currentUserId = (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();

      // Mark messages as own if sent by current user
      const processedMessages = messages.map((msg) => ({
        ...msg,
        isOwn: msg.senderId === currentUserId,
      }));

      set((state) => ({
        activeChat: chat,
        messages: {
          ...state.messages,
          [chat.roomId]: processedMessages,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error selecting chat:", error);
    }
  },

  setActiveChat: (chat) => {
    set({ activeChat: chat });
  },

  clearError: () => {
    set({ error: null });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, activeChat: null, messages: {} });
  },

  getTotalUnread: () => {
    const chats = get().chats || [];
    return chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
  },
}));

export default useChat;
