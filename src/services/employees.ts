import api from "./api";

export const editEmployee = async (employeeId: string, employeeData: any) => {
    try {
        const response = await api.put(`/employee/${employeeId}`, employeeData);
        return response.data;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
}

export const getEmployees = async (params: any) => {
    try {
        const response = await api.get("/employee", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
}