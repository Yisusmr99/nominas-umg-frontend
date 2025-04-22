import api from "./api";

export const getDeductions = async () => {
    try {
        const response = await api.get('/deduction');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createDeduction = async (data: any) => {
    try {
        const response = await api.post('/deduction', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateDeduction = async (id: number, data: any) => {
    try {
        const response = await api.put(`/deduction/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteDeduction = async (id: number) => {
    try {
        const response = await api.delete(`/deduction/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}