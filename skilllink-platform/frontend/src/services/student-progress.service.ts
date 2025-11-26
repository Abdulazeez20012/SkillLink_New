import api from './api';

export const studentProgressService = {
  async getStudentProgress(studentId: string, cohortId: string) {
    const response = await api.get(`/student-progress/student/${studentId}/cohort/${cohortId}`);
    return response.data.data;
  },

  async getCohortStudentsProgress(cohortId: string) {
    const response = await api.get(`/student-progress/cohort/${cohortId}/students`);
    return response.data.data;
  }
};
