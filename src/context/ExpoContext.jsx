import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { expoApi, settingsApi } from '../services/api';

const ExpoContext = createContext(null);

export function ExpoProvider({ children }) {
  const [currentExpo, setCurrentExpo] = useState(null);
  const [allExpos, setAllExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all expos
  const fetchAllExpos = useCallback(async () => {
    try {
      const response = await expoApi.getAll(1, 100); // Get all expos
      const expos = response.data?.data || [];
      setAllExpos(expos);
      return expos;
    } catch (err) {
      console.error('Failed to fetch expos:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Fetch current expo from server
  const fetchCurrentExpo = useCallback(async () => {
    try {
      const response = await settingsApi.getCurrentExpo();
      if (response.success && response.data) {
        setCurrentExpo(response.data);
        // Also save to localStorage as backup
        localStorage.setItem('currentExpo', JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.error('Failed to fetch current expo:', err);
      // Try to get from localStorage as fallback
      const stored = localStorage.getItem('currentExpo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentExpo(parsed);
          return parsed;
        } catch (e) {
          console.error('Failed to parse stored expo');
        }
      }
    }
    return null;
  }, []);

  // Set current expo
  const selectExpo = useCallback(async (expo) => {
    try {
      setLoading(true);
      
      // Update on server
      const response = await settingsApi.setCurrentExpo(expo.id);
      
      if (response.success) {
        const updatedExpo = response.data;
        setCurrentExpo(updatedExpo);
        localStorage.setItem('currentExpo', JSON.stringify(updatedExpo));
        return { success: true, data: updatedExpo };
      } else {
        throw new Error(response.message || 'Failed to update expo');
      }
    } catch (err) {
      console.error('Failed to set current expo:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await fetchAllExpos();
        await fetchCurrentExpo();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchAllExpos, fetchCurrentExpo]);

  // Refresh data
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await fetchAllExpos();
      await fetchCurrentExpo();
    } finally {
      setLoading(false);
    }
  }, [fetchAllExpos, fetchCurrentExpo]);

  const value = {
    currentExpo,
    allExpos,
    loading,
    error,
    selectExpo,
    refresh,
    fetchAllExpos,
    fetchCurrentExpo,
  };

  return (
    <ExpoContext.Provider value={value}>
      {children}
    </ExpoContext.Provider>
  );
}

// Custom hook to use expo context
export function useExpo() {
  const context = useContext(ExpoContext);
  if (!context) {
    throw new Error('useExpo must be used within an ExpoProvider');
  }
  return context;
}

export default ExpoContext;