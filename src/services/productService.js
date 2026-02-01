import apiClient from './apiClient';

export const getProducts = async (params = {}) => {
    try {
        const response = await apiClient.get('api/products', { params });
        return response.data;
    } catch (error) {
        console.error('Get products error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

export const getProductCategories = async () => {
    try {
        const response = await apiClient.get('api/products/categories');
        return response.data;
    } catch (error) {
        console.error('Get categories error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await apiClient.get(`api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get product details error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};
