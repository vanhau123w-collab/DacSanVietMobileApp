import axios from 'axios';

// 10.0.2.2 is special alias to your host loopback interface (i.e., 127.0.0.1 on your development machine)
// Use this for Android Emulator.
const BASE_URL = 'http://10.0.2.2:3001/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default apiClient;
