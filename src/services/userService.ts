
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
    
    if (response.error) {
      console.error('Failed to fetch users:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async getUserById(id: number) {
    console.log('Fetching user by ID:', id);
    const response = await apiService.get<User>(`/user/api/user_data/${id}/`);
    
    if (response.error) {
      console.error('Failed to fetch user:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async searchUsersByName(name: string) {
    console.log('Searching users by name:', name);
    const response = await apiService.get<User[]>(`/user/api/user_data?name=${encodeURIComponent(name)}`);
    
    if (response.error) {
      console.error('Failed to search users:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }
}

export const userService = new UserService();
