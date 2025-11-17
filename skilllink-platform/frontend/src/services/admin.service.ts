import api from './api';

export const adminService = {
  async getAnalytics() {
    const response = await api.get('/admin/analytics');
    return response.data.data;
  },

  async getFacilitators() {
    const response = await api.get('/admin/facilitators');
    return response.data.data;
  },

  async createFacilitator(data: { email: string; password: string; name: string }) {
    const response = await api.post('/admin/facilitators', data);
    return response.data.data;
  },

  async regenerateAccessCode(facilitatorId: string) {
    const response = await api.post(`/admin/facilitators/${facilitatorId}/regenerate-code`);
    return response.data.data;
  },

  async getStudents() {
    const response = await api.get('/admin/students');
    return response.data.data;
  },

  async inviteStudents(cohortId: string, emails: string[]) {
    const response = await api.post('/admin/invite-students', { cohortId, emails });
    return response.data.data;
  },

  async regenerateInviteLinks(cohortId: string) {
    const response = await api.post(`/admin/cohorts/${cohortId}/regenerate-links`);
    return response.data.data;
  },

  async toggleUserStatus(userId: string) {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data.data;
  }
};
