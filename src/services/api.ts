
const API_BASE_URL = 'https://api.prod.troopod.io';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`Making API request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (response.status === 401 && this.refreshToken && endpoint !== '/api/token/refresh/') {
        console.log('Access token expired, attempting refresh...');
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${this.accessToken}`,
          };
          const retryResponse = await fetch(url, config);
          const data = retryResponse.ok ? await retryResponse.json() : null;
          console.log('Retry response status:', retryResponse.status);
          return { data, status: retryResponse.status };
        }
      }

      const data = response.ok ? await response.json() : null;
      console.log('API response status:', response.status, 'Data:', data);
      return { data, status: response.status };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error', status: 0 };
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    console.log('Attempting login for username:', username);
    const response = await this.makeRequest<AuthTokens>('/api/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.data && response.status === 200) {
      this.accessToken = response.data.access;
      this.refreshToken = response.data.refresh;
      
      localStorage.setItem('access_token', this.accessToken);
      localStorage.setItem('refresh_token', this.refreshToken);
      
      console.log('Login successful');
      return true;
    }
    
    console.log('Login failed with status:', response.status);
    return false;
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.log('No refresh token available');
      return false;
    }

    const response = await this.makeRequest<{ access: string }>('/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    if (response.data && response.status === 200) {
      this.accessToken = response.data.access;
      localStorage.setItem('access_token', this.accessToken);
      console.log('Token refreshed successfully');
      return true;
    }

    console.log('Token refresh failed');
    this.logout(); // Clear invalid tokens
    return false;
  }

  logout(): void {
    console.log('Logging out');
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Generic API methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
