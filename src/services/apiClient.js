import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost for Web/iOS, 10.0.2.2 for Android Emulator
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/' : 'http://localhost:3001/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    // Removed default Content-Type to let Axios handle FormData (multipart) vs JSON automatically
    headers: {},
    timeout: 10000,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
