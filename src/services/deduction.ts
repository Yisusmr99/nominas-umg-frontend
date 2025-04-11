import api from "./api";

export const getDeductions = async () => {
    try {
        const response = await api.get('/deduction');
        return response.data;
    } catch (error) {
        throw error;
    }
};