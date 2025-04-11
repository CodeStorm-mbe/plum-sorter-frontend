import axios from 'axios';

// Base URL for the API - replace with your actual API endpoint
const API_BASE_URL = 'https://api.example.com';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service functions
export const analyzeImage = async (imageFile) => {
    try {
        // Create form data to send the image
        const formData = new FormData();
        formData.append('image', imageFile);

        // POST request to the analyze endpoint
        const response = await apiClient.post('/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
};

export const getStats = async () => {
    try {
        const response = await apiClient.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

export const getRecentImages = async (filters = {}) => {
    try {
        const response = await apiClient.get('/images/recent', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching recent images:', error);
        throw error;
    }
};

export default {
    analyzeImage,
    getStats,
    getRecentImages,
};
