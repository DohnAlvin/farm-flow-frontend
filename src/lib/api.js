/**
 * 🚜 FarmFlow API Bridge
 * Standardizes all requests to the Django backend and handles silent JWT refreshing.
 */

// ✅ THE MAGIC FIX: Replaced the local '/api' with the full live Render URL!
const API_BASE = 'https://farmflow-api-s521.onrender.com/api';

export const api = {
  async request(endpoint, options = {}) {
    // This will now correctly build: https://farmflow-api-s521.onrender.com/api/users/me/
    const url = `${API_BASE}${endpoint}`;
    
    // 🔐 1. Grab the VIP wristband (JWT token) from Local Storage
    let token = localStorage.getItem('access_token');

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 🔐 2. Safely attach token to headers (preventing "undefined" bug)
    if (token && token !== 'undefined' && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      let response = await fetch(url, config);

      // 🔄 3. THE SILENT REFRESH: Handle 401 Unauthorized 
      if (response.status === 401 && !options._retry) {
        options._retry = true; // Mark this request so we don't infinitely loop
        
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
            try {
                // Silently ask Django for a new access token
                const refreshResponse = await fetch(`${API_BASE}/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newAccessToken = data.access || data.access_token;
                    
                    // Save the shiny new token
                    localStorage.setItem('access_token', newAccessToken);
                    
                    // Update headers and retry the original failed request!
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    response = await fetch(url, config); 
                } else {
                    throw new Error("Refresh token expired");
                }
            } catch (refreshError) {
                // If refresh fails, clear everything and kick to login
                console.error("🔄 Token refresh failed:", refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                throw new Error("Session expired. Please log in again.");
            }
        } else {
            // No refresh token exists, boot them out
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            throw new Error("Unauthorized");
        }
      } else if (response.status === 401) {
          // If it's a 401 AND we already tried retrying, boot them out
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (window.location.pathname !== '/login') {
              window.location.href = '/login';
          }
          throw new Error("Unauthorized");
      }

      // Handle standard API errors safely
      if (!response.ok) {
        // Read as text first just in case Django sends an HTML error page (like a 500 error)
        const errorText = await response.text();
        let errorData = {};
        try { errorData = JSON.parse(errorText); } catch(e) {}
        
        throw new Error(errorData.detail || errorData.error || `Error: ${response.status}`);
      }

      // Check for 204 No Content (standard for DELETE) to avoid json() crash
      if (response.status === 204) return null;

      return response.json();
    } catch (error) {
      console.error("📡 API Fetch Error:", error.message);
      throw error;
    }
  },

  // Helper methods for cleaner syntax across the app
  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  
  post: (endpoint, data) => api.request(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  put: (endpoint, data) => api.request(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  delete: (endpoint) => api.request(endpoint, { 
    method: 'DELETE' 
  }),
};