
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(apiService.isAuthenticated());
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const success = await apiService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
