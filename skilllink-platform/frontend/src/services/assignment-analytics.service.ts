import api from './api';

export const assignmentAnalyticsService = {
  async getAssignmentAnalytics(assignmentId: string) {
    const response = await api.get(`/assignment-analytics/assignment/${assignmentId}`);
    return response.data.data;
  },

  async getCohortAssignmentAnalytics(cohortId: string) {
    const response = await api.get(`/assignment-analytics/cohort/${cohortId}/assignments`);
    return response.data.data;
  }
};
