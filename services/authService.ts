import api from '@/lib/api';

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}


class AuthService {
    async signup(data: SignupData) {
        const response = await api.post('/auth/signup', data);
        return response.data;
    }

    async login(data: LoginData) {
        const response = await api.post('/auth/login', data);
        return response.data;
    }

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    }
}

export default new AuthService();
