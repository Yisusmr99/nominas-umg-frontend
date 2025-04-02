import api from "./api";

export const login = async (data: {email: string, password: string}) => {
    try {
        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await api.post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } catch (error) {
        // Aún si falla la petición, limpiamos el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
    }
};