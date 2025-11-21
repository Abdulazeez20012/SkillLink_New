import api from './api';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  userId: string;
  cohortId: string;
  solved: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  cohort: {
    id: string;
    name: string;
  };
  answers?: ForumAnswer[];
  _count?: {
    answers: number;
  };
}

export interface ForumAnswer {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isCorrect: boolean;
  endorsements: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const forumService = {
  // Create a new forum post
  async createPost(data: {
    title: string;
    content: string;
    cohortId: string;
    tags?: string[];
  }) {
    const response = await api.post('/forum/posts', data);
    return response.data.data;
  },

  // Get all forum posts with optional filters
  async getPosts(filters?: {
    cohortId?: string;
    solved?: boolean;
    tag?: string;
  }) {
    const response = await api.get('/forum/posts', { params: filters });
    return response.data.data;
  },

  // Get a single post by ID
  async getPostById(id: string) {
    const response = await api.get(`/forum/posts/${id}`);
    return response.data.data;
  },

  // Create an answer to a post
  async createAnswer(postId: string, content: string) {
    const response = await api.post(`/forum/posts/${postId}/answers`, { content });
    return response.data.data;
  },

  // Mark a post as solved
  async markAsSolved(postId: string) {
    const response = await api.put(`/forum/posts/${postId}/solve`);
    return response.data.data;
  },

  // Endorse an answer (upvote)
  async endorseAnswer(answerId: string) {
    const response = await api.put(`/forum/answers/${answerId}/endorse`);
    return response.data.data;
  }
};
