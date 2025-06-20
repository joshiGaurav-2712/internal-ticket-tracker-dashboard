
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
    return apiService.get<User[]>('/user/api/user_data/');
  }

  async getUserById(id: number) {
    return apiService.get<User>(`/user/api/user_data/${id}/`);
  }

  async searchUsersByName(name: string) {
    return apiService.get<User[]>(`/user/api/user_data?name=${encodeURIComponent(name)}`);
  }
}

export const userService = new UserService();
