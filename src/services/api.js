// services/api.js

const API_BASE_URL = 'https://www.fist-o.com/eco_energy/api';

async function fetchApi(endpoint, options = {}) {
  let url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  if (method !== 'GET') {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}_method=${method}`;
  }
  
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = options.body;
  }

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response');
    }

    // Return the data even if not ok - so we can access errors
    if (!response.ok) {
      // Return the full response including errors
      return {
        success: false,
        status: response.status,
        message: data.message || 'Request failed',
        errors: data.errors || null,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // If it's already our formatted error, return it
    if (error.status && error.message) {
      return {
        success: false,
        status: error.status,
        message: error.message,
        errors: error.errors || null,
      };
    }
    // Otherwise throw a new error
    throw {
      success: false,
      status: 500,
      message: error.message || 'Network error',
      errors: null,
    };
  }
}


// ============================================
// EXPO API
// ============================================
export const expoApi = {
  getAll: async (page = 1, limit = 100, search = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), search: search || '' });
    return fetchApi(`/expos?${params}`);
  },
  getById: async (id) => fetchApi(`/expos/${id}`),
  create: async (data) => fetchApi('/expos', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`/expos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`/expos/${id}`, { method: 'DELETE' }),
};

// ============================================
// PRODUCT API
// ============================================
export const productApi = {
  getAll: async (page = 1, limit = 100, search = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), search: search || '' });
    return fetchApi(`/products?${params}`);
  },
  getById: async (id) => fetchApi(`/products/${id}`),
  create: async (data) => fetchApi('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`/products/${id}`, { method: 'DELETE' }),
  
  // Get unique categories
  getCategories: async () => {
    return fetchApi('/product-categories');
  },
  
  // Get sizes by category (returns products with that category)
  getSizesByCategory: async (category) => {
    const params = new URLSearchParams({ category });
    return fetchApi(`/product-sizes?${params}`);
  },
  
  // Get products by category
  getByCategory: async (category) => {
    const params = new URLSearchParams({ category });
    return fetchApi(`/products?${params}`);
  },
};

// ============================================
// ENTRY TYPE API
// ============================================
export const entryTypeApi = {
  getAll: async (page = 1, limit = 100, search = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), search: search || '' });
    return fetchApi(`/entry-types?${params}`);
  },
  getById: async (id) => fetchApi(`/entry-types/${id}`),
  create: async (data) => fetchApi('/entry-types', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`/entry-types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`/entry-types/${id}`, { method: 'DELETE' }),
};

// ============================================
// WHATSAPP MESSAGE API
// ============================================
export const whatsappApi = {
  getAll: async (page = 1, limit = 100, search = '') => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), search: search || '' });
    return fetchApi(`/whatsapp-messages?${params}`);
  },
  getById: async (id) => fetchApi(`/whatsapp-messages/${id}`),
  create: async (data) => fetchApi('/whatsapp-messages', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`/whatsapp-messages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`/whatsapp-messages/${id}`, { method: 'DELETE' }),
};

// ============================================
// CUSTOMER API
// ============================================
export const customerApi = {
  getAll: async (page = 1, limit = 10, search = '', expoId = null) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), search: search || '' });
    if (expoId) params.append('expo_id', String(expoId));
    return fetchApi(`/customers?${params}`);
  },
  getById: async (id) => fetchApi(`/customers/${id}`),
  create: async (data) => fetchApi('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`/customers/${id}`, { method: 'DELETE' }),
  
  // Upload file
  uploadFile: async (customerId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/upload?customer_id=${customerId}&_method=POST`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Upload failed',
      };
    }

    return data;
  },
};

// ============================================
// SETTINGS API
// ============================================
export const settingsApi = {
  getCurrentExpo: async () => fetchApi('/current-expo'),
  setCurrentExpo: async (expoId) => fetchApi('/current-expo', { 
    method: 'POST', 
    body: JSON.stringify({ expo_id: expoId }) 
  }),
  getAll: async () => fetchApi('/settings'),
  set: async (key, value) => fetchApi('/settings', { 
    method: 'POST', 
    body: JSON.stringify({ key, value }) 
  }),
};
// ============================================
// EMPLOYEE API
// ============================================
export const employeeApi = {
  getAll: async (page = 1, limit = 10, search = '', filters = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search || '',
      department: filters.department || 'All',
      role: filters.role || 'All',
      status: filters.status || 'All'
    });
    return fetchApi(`/employees?${params}`);
  },
  
  getById: async (id) => fetchApi(`/employees/${id}`),
  
  create: async (data) => fetchApi('/employees', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  update: async (id, data) => fetchApi(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: async (id) => fetchApi(`/employees/${id}`, {
    method: 'DELETE'
  }),
  
  toggleStatus: async (id) => fetchApi(`/employees/${id}`, {
    method: 'PATCH'
  }),
};

// ============================================
// DEPARTMENT API
// ============================================
export const departmentApi = {
  getAll: async () => fetchApi('/departments'),
  
  create: async (name) => fetchApi('/departments', {
    method: 'POST',
    body: JSON.stringify({ name })
  }),
  
  delete: async (id) => fetchApi(`/departments/${id}`, {
    method: 'DELETE'
  }),
};

// ============================================
// AUTH API
// ============================================
export const authApi = {
  login: async (username, password) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  logout: async () => {
    const token = localStorage.getItem('authToken');
    return fetchApi('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  me: async () => {
    const token = localStorage.getItem('authToken');
    return fetchApi('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('authToken');
    return fetchApi('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
  }
};

export default {
  expo: expoApi,
  product: productApi,
  entryType: entryTypeApi,
  whatsapp: whatsappApi,
  customer: customerApi,
  settings: settingsApi,
  employee: employeeApi,
  department: departmentApi,
  auth: authApi,
};