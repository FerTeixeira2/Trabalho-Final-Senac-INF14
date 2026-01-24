import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/asset';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated users database
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', email: 'admin@empresa.com', name: 'Administrador', role: 'admin', password: 'admin123' },
  { id: '2', email: 'usuario@empresa.com', name: 'Usuário Comum', role: 'user', password: 'user123' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setAuthState({ user: userWithoutPassword, isAuthenticated: true });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({ user: null, isAuthenticated: false });
  };

  const isAdmin = authState.user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
