import api from './api';

export const rubricService = {
  async createRubric(data: {
    assignmentId: string;
    name: string;
    description?: string;
    criteria: Array<{
      name: string;
      description?: string;
      maxPoints: number;
    }>;
  }) {
    const response = await api.post('/rubrics', data);
    return response.data.data;
  },

  async getRubricByAssignment(assignmentId: string) {
    const response = await api.get(`/rubrics/assignment/${assignmentId}`);
    return response.data.data;
  },

  async updateRubric(rubricId: string, data: any) {
    const response = await api.put(`/rubrics/${rubricId}`, data);
    return response.data.data;
  },

  async deleteRubric(rubricId: string) {
    const response = await api.delete(`/rubrics/${rubricId}`);
    return response.data;
  }
};
