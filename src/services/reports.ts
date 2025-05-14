import api from "./api";

export const getReports = async (params: any) => {
  try {
    const response = await api.get("/report/payroll", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const exportReport = (params: any) => {
    const query = new URLSearchParams(params).toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/export?${query}`;
    window.open(url, "_blank");
};