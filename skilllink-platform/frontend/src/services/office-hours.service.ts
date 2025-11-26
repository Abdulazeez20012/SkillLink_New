import api from './api';

export const officeHoursService = {
  async createOfficeHours(data: {
    cohortId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    meetingUrl?: string;
    maxAttendees?: number;
    isRecurring?: boolean;
    recurrencePattern?: string;
  }) {
    const response = await api.post('/office-hours', data);
    return response.data.data;
  },

  async getOfficeHoursByCohort(cohortId: string) {
    const response = await api.get(`/office-hours/cohort/${cohortId}`);
    return response.data.data;
  },

  async getMyOfficeHours() {
    const response = await api.get('/office-hours/my-office-hours');
    return response.data.data;
  },

  async getMyBookings() {
    const response = await api.get('/office-hours/my-bookings');
    return response.data.data;
  },

  async bookOfficeHours(officeHoursId: string, notes?: string) {
    const response = await api.post(`/office-hours/${officeHoursId}/book`, { notes });
    return response.data.data;
  },

  async cancelBooking(bookingId: string) {
    const response = await api.put(`/office-hours/bookings/${bookingId}/cancel`);
    return response.data.data;
  },

  async updateOfficeHours(id: string, data: any) {
    const response = await api.put(`/office-hours/${id}`, data);
    return response.data.data;
  },

  async deleteOfficeHours(id: string) {
    const response = await api.delete(`/office-hours/${id}`);
    return response.data;
  }
};
