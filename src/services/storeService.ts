
import { apiService } from './api';

export interface Store {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

class StoreService {
  async getAllStores() {
    console.log('StoreService: Fetching all stores...');
    console.log('Current token available:', !!apiService.getCurrentToken());
    
    const response = await apiService.get<Store[]>('/store/');
    console.log('StoreService: Stores response:', response);
    
    if (response.error) {
      console.error('StoreService: Failed to fetch stores:', response.error);
      throw new Error(response.error);
    }
    
    // Additional logging for debugging
    if (response.data) {
      console.log('StoreService: Stores data received:', response.data.map(s => ({ 
        id: s.id, 
        name: s.name 
      })));
    }
    
    return response;
  }

  async getStoreById(id: number) {
    console.log('StoreService: Fetching store by ID:', id);
    const response = await apiService.get<Store>(`/store/${id}/`);
    console.log('StoreService: Store response:', response);
    
    if (response.error) {
      console.error('StoreService: Failed to fetch store:', response.error);
      throw new Error(response.error);
    }
    
    return response;
  }
}

export const storeService = new StoreService();
