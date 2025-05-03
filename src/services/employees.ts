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