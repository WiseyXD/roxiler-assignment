
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your server URL

export const fetchTransactions = async (month: string, search: string, page: number, perPage: number) => {
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
        params: { month, search, page, perPage },
    });
    return response.data;
};

export const fetchStatistics = async (month: string) => {
    const response = await axios.get(`${API_BASE_URL}/transactions/statistics`, {
        params: { month },
    });
    return response.data;
};

export const fetchBarChartData = async (month: string) => {
    const response = await axios.get(`${API_BASE_URL}/transactions/bar-chart`, {
        params: { month },
    });
    return response.data;
};
