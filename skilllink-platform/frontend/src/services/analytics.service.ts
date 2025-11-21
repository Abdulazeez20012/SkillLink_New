import api from './api';

export const analyticsService = {
  // Get cohort analytics
  async getCohortAnalytics(cohortId: string) {
    const response = await api.get(`/analytics/facilitator/${cohortId}`);
    return response.data.data;
  },

  // Get student progress
  async getStudentProgress() {
    const response = await api.get('/analytics/student/progress');
    return response.data.data;
  },

  // Get admin overview
  async getAdminOverview() {
    const response = await api.get('/analytics/admin/overview');
    return response.data.data;
  },

  // Export data
  async exportData(type: 'csv' | 'pdf', cohortId?: string) {
    const response = await api.post('/analytics/export', {
      type,
      cohortId
    }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
