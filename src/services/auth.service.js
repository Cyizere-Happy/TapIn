import { apiClient } from './apiClient';

class AuthService {
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            if (response.success && response.token) {
                localStorage.setItem('tapin_token', response.token);
                localStorage.setItem('tapin_user', JSON.stringify(response.user));
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('tapin_token');
        localStorage.removeItem('tapin_user');
    }

    getCurrentUser() {
        const user = localStorage.getItem('tapin_user');
        return user ? JSON.parse(user) : null;
    }

    async getMe() {
        try {
            return await apiClient.get('/auth/me');
        } catch (error) {
            throw error;
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('tapin_token');
    }
}

export const authService = new AuthService();
