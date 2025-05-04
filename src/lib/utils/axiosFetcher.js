// lib/api.js
import axios from "axios";

// Create axios instance with base URL from environment variables
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    // Other default headers can be added here
  },
});

// Request interceptor (empty for now, ready for future token implementation)
apiClient.interceptors.request.use(
  (config) => {
    /*
     * Future token implementation can go here:
     * const token = getAuthToken();
     * if (token) config.headers.Authorization = `Bearer ${token}`;
     */
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (basic error handling)
apiClient.interceptors.response.use(
  (response) => response.data, // Directly return the data
  (error) => {
    /*
     * Future error handling can be expanded here:
     * - Global error notifications
     * - Automatic token refresh on 401
     * - Redirect to login on auth errors
     */

    // Convert to consistent error format
    const apiError = {
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
