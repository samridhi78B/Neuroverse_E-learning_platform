import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neuroverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neuroverse_token');
      localStorage.removeItem('neuroverse_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('neuroverse_token', response.data.token);
        localStorage.setItem('neuroverse_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  async login(credentials) {
    try {
      const response = await API.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('neuroverse_token', response.data.token);
        localStorage.setItem('neuroverse_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  logout() {
    localStorage.removeItem('neuroverse_token');
    localStorage.removeItem('neuroverse_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('neuroverse_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('neuroverse_token');
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  async getProfile() {
    try {
      const response = await API.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  async updateXP(xp) {
    try {
      const response = await API.post('/user/update-xp', { xp });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update XP' };
    }
  },

  async updatePlanetXP(planetId, xp) {
    try {
      const response = await API.post('/user/update-planet-xp', { planetId, xp });
      
      // Update local storage user data to reflect new XP and planetXP
      const currentUser = this.getCurrentUser();
      if (currentUser && response.data) {
        const updatedUser = { 
          ...currentUser, 
          xp: response.data.xp, 
          level: response.data.level,
          planetXP: response.data.planetXP
        };
        localStorage.setItem('neuroverse_user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update planet XP' };
    }
  },

  async healthCheck() {
    try {
      const response = await API.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Health check failed' };
    }
  },

  async getLeaderboard() {
    try {
      const response = await API.get('/leaderboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch leaderboard' };
    }
  },

  async resetXP() {
    try {
      const response = await API.post('/user/reset-xp');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to reset XP' };
    }
  },
};

export default authService;
