import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Validate token with server
        const response = await authApi.me();
        if (response.success && response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } else {
          // Token invalid, clear storage
          clearAuth();
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Keep user logged in with stored data if server is unreachable
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(username, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userDepartment', userData.department);
        localStorage.setItem('loginTime', new Date().toISOString());
        
        setUser(userData);
        setLoading(false);
        
        return { success: true, user: userData };
      } else {
        setError(response.message || 'Login failed');
        setLoading(false);
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('loginTime');
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Update individual items
    if (updatedData.name) localStorage.setItem('userName', updatedData.name);
    if (updatedData.email) localStorage.setItem('userEmail', updatedData.email);
    if (updatedData.role) localStorage.setItem('userRole', updatedData.role);
    if (updatedData.department) localStorage.setItem('userDepartment', updatedData.department);
  };

  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;