import axios, { AxiosResponse } from 'axios';
import { User, UserFormData, ApiResponse, UsersResponse, ApiError } from '../types/user';

// Configure axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-your-project-id.cloudfunctions.net',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export class UserService {
  // Get all users
  static async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<ApiResponse<UsersResponse>> = await api.get('/users');
      if (response.data.success && response.data.data) {
        return response.data.data.users;
      }
      throw new Error(response.data.error || 'Failed to fetch users');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw this.handleApiError(error);
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch user');
    } catch (error) {
      console.error('Error fetching user:', error);
      throw this.handleApiError(error);
    }
  }

  // Create new user
  static async createUser(userData: UserFormData): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.post('/users', userData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create user');
    } catch (error) {
      console.error('Error creating user:', error);
      throw this.handleApiError(error);
    }
  }

  // Update user
  static async updateUser(id: string, userData: Partial<UserFormData>): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, userData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to update user');
    } catch (error) {
      console.error('Error updating user:', error);
      throw this.handleApiError(error);
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/users/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw this.handleApiError(error);
    }
  }

  // Error handler
  private static handleApiError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.error || error.message,
        code: error.code,
        details: error.response?.data,
      };
    }
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
}