import api from './api';

export const messageService = {
  async sendMessage(receiverId: string, content: string) {
    const response = await api.post('/messages', { receiverId, content });
    return response.data.data;
  },

  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  async getConversation(partnerId: string) {
    const response = await api.get(`/messages/conversation/${partnerId}`);
    return response.data.data;
  },

  async markAsRead(partnerId: string) {
    const response = await api.put(`/messages/read/${partnerId}`);
    return response.data;
  }
};
