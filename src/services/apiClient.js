import { API_CONFIG } from '../config/api.config';

class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('tapin_token');

        const headers = {
            ...API_CONFIG.HEADERS,
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle specific security errors
                if (response.status === 401) {
                    localStorage.removeItem('tapin_token');
                    // Optional: redirect to login or broadcast logout
                }

                const error = new Error(data.message || 'An unexpected error occurred');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
