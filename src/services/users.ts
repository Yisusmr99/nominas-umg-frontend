import api from "./api";

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const lowUser = async (userId: number) => {
  try {
    const response = await api.put(`/user/low/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
}