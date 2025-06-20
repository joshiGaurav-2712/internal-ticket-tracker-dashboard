
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
    return apiService.get<Store[]>('/store/');
  }
}

export const storeService = new StoreService();
