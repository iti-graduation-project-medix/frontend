import axios from "../api/axios";

const drugAlertService = {
  // Get all drug alert notifications for the current user
  async getDrugAlertNotifications() {
    try {
      const response = await axios.get("/drug-alert-notification", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        params: {
          _t: Date.now(), // Add timestamp to prevent caching
        },
      });
      console.log("📋 Drug alert notifications response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching drug alert notifications:", error);
      throw error;
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await axios.get(
        "/drug-alert-notification/unread-count",
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          params: {
            _t: Date.now(), // Add timestamp to prevent caching
          },
        }
      );
      console.log("📊 Unread count response:", response.data);
      return response.data.count || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await axios.patch(
        `/drug-alert-notification/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },
};

export default drugAlertService;
