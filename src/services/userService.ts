
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
    console.log('UserService: Fetching all users...');
    console.log('Current token available:', !!apiService.getCurrentToken());
    
    const response = await apiService.get<User[]>('/user/api/user_data/');
    console.log('UserService: Users response:', response);
    
    if (response.error) {
      console.error('UserService: Failed to fetch users:', response.error);
      throw new Error(response.error);
    }
    
    // Log user details for debugging
    if (response.data) {
      console.log('UserService: Users data received:', response.data.map(u => ({ 
        id: u.id, 
        username: u.username, 
        name: u.name || `${u.first_name} ${u.last_name}`.trim() 
      })));
    }
    
    return response;
  }

  async getUserById(id: number) {
    console.log('UserService: Fetching user by ID:', id);
    const response = await apiService.get<User>(`/user/api/user_data/${id}/`);
    console.log('UserService: User response:', response);
    
    if (response.error) {
      console.error('UserService: Failed to fetch user:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }
  async searchUsersByName(name: string) {
    console.log('UserService: Searching users by name:', name);
    const response = await apiService.get<User[]>(`/user/api/user_data/?name=${encodeURIComponent(name)}`);
    console.log('UserService: Search response:', response);
    
    if (response.error) {
      console.error('UserService: Failed to search users:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  async getUsersByIds(ids: number[]) {
    console.log('UserService: Fetching users by IDs:', ids);
    if (ids.length === 0) return { data: [] };
    
    const idsParam = ids.join(',');
    const response = await apiService.get<User[]>(`/user/api/user_data/?ids=${idsParam}`);
    console.log('UserService: Users by IDs response:', response);
    
    if (response.error) {
      console.error('UserService: Failed to fetch users by IDs:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }

  // Helper method to get user display name
  getUserDisplayName(user: User): string {
    if (user.name) return user.name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username;
  }
}

export const userService = new UserService();
