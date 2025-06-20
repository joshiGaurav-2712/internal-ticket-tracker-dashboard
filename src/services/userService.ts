
import { apiService } from './api';

export interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

class UserService {
  async getAllUsers() {
    console.log('Fetching all users...');
    const response = await apiService.get<User[]>('/user/api/user_data/');
    console.log('Users response:', response);
    return response;
  }

  async getUserById(id: number) {
    console.log('Fetching user by ID:', id);
    return apiService.get<User>(`/user/api/user_data/${id}/`);
  }

  async searchUsersByName(name: string) {
    console.log('Searching users by name:', name);
    return apiService.get<User[]>(`/user/api/user_data?name=${encodeURIComponent(name)}`);
  }
}

export const userService = new UserService();
