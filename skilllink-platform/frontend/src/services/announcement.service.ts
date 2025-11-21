import api from './api';

export const announcementService = {
  // Create announcement
  async createAnnouncement(data: {
    title: string;
    content: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    cohortId?: string;
  }) {
    const response = await api.post('/announcements', data);
    return response.data.data;
  },

  // Get announcements
  async getAnnouncements(cohortId?: string) {
    const response = await api.get('/announcements', {
      params: { cohortId }
    });
    return response.data.data;
  },

  // Get announcement by ID
  async getAnnouncementById(id: string) {
    const response = await api.get(`/announcements/${id}`);
    return response.data.data;
  },

  // Update announcement
  async updateAnnouncement(id: string, data: {
    title?: string;
    content?: string;
    priority?: string;
  }) {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data.data;
  },

  // Delete announcement
  async deleteAnnouncement(id: string) {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};
