import api from './api';

export interface StudyRecommendation {
  recommendations: string[];
}

export interface CodeAnalysis {
  complexity: 'low' | 'medium' | 'high';
  suggestions: string[];
  strengths: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

class AIService {
  async getStudyRecommendations(): Promise<StudyRecommendation> {
    const response = await api.get('/ai/recommendations');
    return response.data;
  }

  async getAssignmentFeedback(submissionId: string): Promise<{ feedback: string }> {
    const response = await api.get(`/ai/feedback/${submissionId}`);
    return response.data;
  }

  async analyzeCode(code: string, language: string = 'javascript'): Promise<CodeAnalysis> {
    const response = await api.post('/ai/analyze-code', { code, language });
    return response.data;
  }

  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<{ questions: QuizQuestion[] }> {
    const response = await api.post('/ai/generate-quiz', { topic, difficulty });
    return response.data;
  }
}

export const aiService = new AIService();
