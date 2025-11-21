import api from './api';

export const assignmentService = {
  // Create assignment (Facilitator)
  async createAssignment(data: {
    title: string;
    description: string;
    dueDate: string;
    maxPoints: number;
    cohortId: string;
  }) {
    const response = await api.post('/assignments', data);
    return response.data.data;
  },

  // Get assignments for a cohort (Facilitator)
  async getCohortAssignments(cohortId: string) {
    const response = await api.get(`/cohorts/${cohortId}/assignments`);
    return response.data.data;
  },

  // Get assignment details
  async getAssignment(assignmentId: string) {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data.data;
  },

  // Update assignment (Facilitator)
  async updateAssignment(assignmentId: string, data: any) {
    const response = await api.put(`/assignments/${assignmentId}`, data);
    return response.data.data;
  },

  // Delete assignment (Facilitator)
  async deleteAssignment(assignmentId: string) {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Get student's assignments
  async getMyAssignments() {
    const response = await api.get('/assignments/my-assignments');
    return response.data.data;
  },

  // Submit assignment (Student)
  async submitAssignment(assignmentId: string, data: {
    content: string;
    githubUrl?: string;
    attachmentUrl?: string;
  }) {
    const response = await api.post(`/assignments/${assignmentId}/submit`, data);
    return response.data.data;
  },

  // Get assignment submissions (Facilitator)
  async getSubmissions(assignmentId: string) {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data.data;
  },

  // Grade submission (Facilitator)
  async gradeSubmission(submissionId: string, data: {
    points: number;
    feedback: string;
  }) {
    const response = await api.put(`/submissions/${submissionId}/grade`, data);
    return response.data.data;
  },

  // Get student's submission for an assignment
  async getMySubmission(assignmentId: string) {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data.data;
  }
};
