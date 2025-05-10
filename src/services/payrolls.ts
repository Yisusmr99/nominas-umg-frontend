import api from "./api";

interface DateRange {
    period_start: string;
    period_end: string;
}

export const getPayrolls = async ( dateRange?: DateRange) => {
    try {
        const response = await api.get('/payroll', { params: dateRange });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const createPayroll = async (data: any) => {
    try {
        const response = await api.post('/payroll', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const payPayroll = async (data: any) => {
    try {
        const response = await api.post('/payroll/pay', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getByEmployee = async (id: number, dateRange?: DateRange) => {
    try {
        const response = await api.get(`/payroll/employee/${id}`, { params: dateRange });
        return response.data;
    } catch (error) {
        throw error;
    }
}