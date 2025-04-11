import api from "./api";

export const getBonuses = async () => {
    try {
        const response = await api.get('/bonus');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createBonus = async (data: any) => {
    try {
        const response = await api.post('/bonus', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateBonus = async (id: number, data: any) => {
    try {
        const response = await api.put(`/bonus/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteBonus = async (id: number) => {
    try {
        const response = await api.delete(`/bonus/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}