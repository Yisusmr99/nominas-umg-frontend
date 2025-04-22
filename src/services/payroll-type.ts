import api from "./api";

export const getPayrollTypes = async () => {
    try {
        const response = await api.get('/payroll_type');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const createPayrollType = async (data: any) => {
    try {
        const response = await api.post('/payroll_type', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updatePayrollType = async (id: number, data: any) => {
    try {
        const response = await api.put(`/payroll_type/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deletePayrollType = async (id: number) => {
    try {
        const response = await api.delete(`/payroll_type/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}