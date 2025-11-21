import api from './api';
import { Cohort } from '../types';

export const cohortService = {
  async getCohorts() {
    const response = await api.get('/cohorts');
    return response.data.data;
  },

  async getCohortById(id: string) {
    const response = await api.get(`/cohorts/${id}`);
    return response.data.data;
  },

  async createCohort(data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }) {
    const response = await api.post('/cohorts', data);
    return response.data.data;
  },

  async updateCohort(id: string, data: Partial<Cohort>) {
    const response = await api.put(`/cohorts/${id}`, data);
    return response.data.data;
  },

  async deleteCohort(id: string) {
    const response = await api.delete(`/cohorts/${id}`);
    return response.data;
  },

  async addMember(cohortId: string, userId: string, role: 'FACILITATOR' | 'STUDENT') {
    const response = await api.post(`/cohorts/${cohortId}/members`, { userId, role });
    return response.data.data;
  },

  async removeMember(cohortId: string, userId: string) {
    const response = await api.delete(`/cohorts/${cohortId}/members/${userId}`);
    return response.data;
  },

  async getMyCohorts() {
    const response = await api.get('/cohorts/my-cohorts');
    return response.data.data;
  }
};
