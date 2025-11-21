import api from './api';

export const attendanceService = {
  // Mark attendance for students (Facilitator)
  async markAttendance(data: {
    cohortId: string;
    date: string;
    attendanceRecords: Array<{
      userId: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
      notes?: string;
    }>;
  }) {
    const response = await api.post('/attendance', data);
    return response.data.data;
  },

  // Get attendance for a cohort (Facilitator)
  async getCohortAttendance(cohortId: string, startDate?: string, endDate?: string) {
    const response = await api.get(`/cohorts/${cohortId}/attendance`, {
      params: { startDate, endDate }
    });
    return response.data.data;
  },

  // Get student's attendance history (Student)
  async getMyAttendance() {
    const response = await api.get('/attendance/my-attendance');
    return response.data.data;
  },

  // Get attendance statistics for a cohort
  async getAttendanceStats(cohortId: string) {
    const response = await api.get(`/cohorts/${cohortId}/attendance/stats`);
    return response.data.data;
  },

  // Get attendance for a specific date
  async getAttendanceByDate(cohortId: string, date: string) {
    const response = await api.get(`/cohorts/${cohortId}/attendance/date/${date}`);
    return response.data.data;
  }
};
