import api from './api';

export const gamificationService = {
  async getLeaderboard(cohortId: string, timeframe: 'weekly' | 'monthly' | 'alltime' = 'alltime') {
    const response = await api.get('/gamification/leaderboard', {
      params: { cohortId, timeframe }
    });
    return response.data.data;
  },

  async getUserStats() {
    const response = await api.get('/gamification/user-stats');
    return response.data.data;
  }
};
