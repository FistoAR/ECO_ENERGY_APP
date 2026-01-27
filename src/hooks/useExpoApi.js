import { useState, useEffect, useCallback } from 'react';
import { expoApi } from '../services/api';

export function useExpoApi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 5,
    total_items: 0,
    total_pages: 0,
  });

  // Fetch expos
  const fetchExpos = useCallback(async (page = 1, limit = 5, search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await expoApi.getAll(page, limit, search);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create expo
  const createExpo = useCallback(async (expoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await expoApi.create(expoData);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update expo
  const updateExpo = useCallback(async (id, expoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await expoApi.update(id, expoData);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete expo
  const deleteExpo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await expoApi.delete(id);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    fetchExpos,
    createExpo,
    updateExpo,
    deleteExpo,
  };
}