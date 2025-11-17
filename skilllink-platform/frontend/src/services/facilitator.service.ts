import api from './api';

export const facilitatorService = {
  async getMyCohorts() {
    const response = await api.get('/facilitator/cohorts');
    return response.data.data;
  },

  async getCohortOverview(cohortId: string) {
    const response = await api.get(`/facilitator/cohorts/${cohortId}/overview`);
    return response.data.data;
  },

  async updateProfile(data: { name?: string; avatar?: string }) {
    const response = await api.put('/facilitator/profile', data);
    return response.data.data;
  }
};
