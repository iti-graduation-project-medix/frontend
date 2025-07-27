import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getChatHistory, getOrCreateChatRoom, getUserChats } from '../../services/chatApi';

global.fetch = vi.fn();
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('chatApi', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.getItem.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getChatHistory', () => {
    it('should fetch chat history successfully', async () => {
      const mockToken = 'test-token';
      const mockMessages = [
        {
          id: 1,
          text: 'Hello',
          sentAt: '2023-01-01T10:00:00Z',
          sender: { id: 1, fullName: 'John Doe', profilePhotoUrl: 'avatar.jpg' }
        }
      ];

      localStorage.getItem.mockReturnValue(mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages
      });

      const result = await getChatHistory('room-123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/room/room-123/messages'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`
          }
        })
      );

      expect(result).toEqual([
        {
          id: 1,
          content: 'Hello',
          timestamp: expect.any(String),
          sender: 'John Doe',
          senderId: 1,
          isOwn: false,
          avatar: 'avatar.jpg',
          status: 'read'
        }
      ]);
    });

    it('should handle fetch error', async () => {
      localStorage.getItem.mockReturnValue('test-token');
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(getChatHistory('room-123')).rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('getOrCreateChatRoom', () => {
    it('should get or create chat room successfully', async () => {
      const mockToken = 'test-token';
      const mockResponse = { chatRoomId: 'room-123' };

      localStorage.getItem.mockReturnValue(mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getOrCreateChatRoom('user1', 'user2', 'target1', 'pharmacy');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/room-id?user1=user1&user2=user2&targetId=target1&targetType=pharmacy'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`
          }
        })
      );

      expect(result).toBe('room-123');
    });
  });

  describe('getUserChats', () => {
    it('should fetch user chats successfully with paginated response', async () => {
      const mockToken = 'test-token';
      const mockResponse = {
        success: true,
        data: {
          chatRooms: [{ id: 1, name: 'Chat 1' }]
        }
      };

      localStorage.getItem.mockReturnValue(mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getUserChats('user-123');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/user/user-123/rooms'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`
          }
        })
      );

      expect(result).toEqual([{ id: 1, name: 'Chat 1' }]);
    });

    it('should handle direct array response', async () => {
      const mockToken = 'test-token';
      const mockResponse = [{ id: 1, name: 'Chat 1' }];

      localStorage.getItem.mockReturnValue(mockToken);
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getUserChats('user-123');

      expect(result).toEqual([{ id: 1, name: 'Chat 1' }]);
    });
  });
});
