import api from "./api";

export const getApplications = async () => {
    try {
        const response = await api.get('/vacation');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const storeAplication = async (data: {employee_id: number, total_days: number, status: number}) => {
    try {
        const response = await api.post('/vacation', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getApplicationByEmployee = async (employee_id: number) => {
    try {
        const response = await api.get(`/vacation/employee/${employee_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const approveApplication = async (id: number) => {
    try {
        const response = await api.put(`/vacation/approve/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addVacationAllEmployees = async () => {
    try {
        const response = await api.post('/vacation/add-vacation');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getVacationBalance = async (employee_id: number) => {
    try {
        const response = await api.get(`/vacation/balance/${employee_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const declineVacation = async (id: number) => {
    try {
        const response = await api.put(`/vacation/decline/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}