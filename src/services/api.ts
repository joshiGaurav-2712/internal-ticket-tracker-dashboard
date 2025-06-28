
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
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    console.log('ApiService initialized with tokens:', {
      hasAccessToken: !!this.accessToken,
      hasRefreshToken: !!this.refreshToken
    });
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Always add Authorization header if we have a token
    if (this.accessToken && !endpoint.includes('/api/token/')) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
      console.log('Adding Authorization header to request:', endpoint);
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`Making API request: ${options.method || 'GET'} ${url}`, {
        hasAuth: !!defaultHeaders['Authorization'],
        headers: config.headers
      });
      
      const response = await fetch(url, config);
      console.log(`Response status for ${endpoint}:`, response.status);
      
      // Handle 401 unauthorized - attempt token refresh
      if (response.status === 401 && this.refreshToken && !endpoint.includes('/api/token/')) {
        console.log('Access token expired or invalid, attempting refresh...');
        
        // Prevent multiple refresh attempts
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();
        }
        
        const refreshed = await this.refreshPromise;
        this.isRefreshing = false;
        this.refreshPromise = null;
        
        if (refreshed) {
          console.log('Token refreshed successfully, retrying original request...');
          // Retry the original request with new token
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${this.accessToken}`,
            },
          };
          
          const retryResponse = await fetch(url, newConfig);
          console.log('Retry response status:', retryResponse.status);
          
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            console.error('Retry request failed:', errorText);
            return { 
              error: `Request failed with status ${retryResponse.status}: ${errorText}`, 
              status: retryResponse.status 
            };
          }
          
          const data = await retryResponse.json();
          return { data, status: retryResponse.status };
        } else {
          console.log('Token refresh failed, redirecting to login');
          return { 
            error: 'Authentication failed. Please login again.', 
            status: 401 
          };
        }
      }

      // Handle response
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse error response, try to get text
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          } catch (textError) {
            console.log('Could not parse error response');
          }
        }
        
        return { 
          error: errorMessage, 
          status: response.status 
        };
      }

      const data = await response.json();
      console.log('API response data:', data);
      return { data, status: response.status };
      
    } catch (error) {
      console.error('API request failed with network error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Network error occurred', 
        status: 0 
      };
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
      
      console.log('Login successful, tokens saved');
      return true;
    }
    
    console.log('Login failed:', response.error, response.status);
    return false;
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.log('No refresh token available for refresh');
      return false;
    }

    console.log('Attempting to refresh access token...');
    const response = await this.makeRequest<{ access: string }>('/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    if (response.data && response.status === 200) {
      this.accessToken = response.data.access;
      localStorage.setItem('access_token', this.accessToken);
      console.log('Access token refreshed successfully');
      return true;
    }

    console.log('Token refresh failed:', response.error);
    this.logout(); // Clear invalid tokens
    return false;
  }

  logout(): void {
    console.log('Logging out, clearing tokens');
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.accessToken;
    console.log('Checking authentication status:', authenticated);
    return authenticated;
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

  // Helper method to get current access token (for debugging)
  getCurrentToken(): string | null {
    return this.accessToken;
  }
}

export const apiService = new ApiService();
