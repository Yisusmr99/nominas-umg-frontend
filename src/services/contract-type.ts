import api from "./api";

export const getContractTypes = async () => {
    try {
        const response = await api.get('/contract_type');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createContractType = async (data: any) => {
    try {
        const response = await api.post('/contract_type', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateContractType = async (id: number, data: any) => {
    try {
        const response = await api.put(`/contract_type/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContractType = async (id: number) => {
    try {
        const response = await api.delete(`/contract_type/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}