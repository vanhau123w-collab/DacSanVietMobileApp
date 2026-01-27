import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for Web/iOS, 10.0.2.2 for Android Emulator
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/' : 'http://localhost:3001/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default apiClient;
