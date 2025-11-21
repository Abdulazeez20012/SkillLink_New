import api from './api';

export const notificationService = {
  // Get all notifications
  async getNotifications(unreadOnly = false) {
    const response = await api.get('/notifications', {
      params: { unreadOnly }
    });
    return response.data.data;
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  // Mark as read
  async markAsRead(id: string) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  // Mark all as read
  async markAllAsRead() {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  async deleteNotification(id: string) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
