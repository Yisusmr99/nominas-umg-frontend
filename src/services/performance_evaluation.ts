import api from "./api";

export const getPerformanceEvaluation = async (params?: any) => {
  try {
    const response = await api.get("/performance-evaluation", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching performance evaluations:", error);
    throw error;
  }
}

export const createPerformanceEvaluation = async (data: any) => {
  try {
    const response = await api.post("/performance-evaluation", data);
    return response.data;
  } catch (error) {
    console.error("Error creating performance evaluation:", error);
    throw error;
  }
}