import api from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface FacilitatorLoginData extends LoginCredentials {
  accessCode: string;
}

export interface StudentRegisterData extends RegisterData {
  inviteToken: string;
}

export const authService = {
  async registerAdmin(data: RegisterData) {
    const response = await api.post('/auth/admin/register', data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async facilitatorLogin(data: FacilitatorLoginData) {
    const response = await api.post('/auth/facilitator/login', data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async registerStudent(data: StudentRegisterData) {
    const response = await api.post('/auth/student/register', data);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data;
  }
};
