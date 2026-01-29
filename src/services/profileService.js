import apiClient from './apiClient';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiClient'; // Ensure BASE_URL is exported or redefine it if strictly local

export const getProfile = async () => {
    try {
        const response = await apiClient.get('api/profile');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateProfile = async (updateData) => {
    try {
        const response = await apiClient.patch('api/profile', updateData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await apiClient.post('api/profile/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const uploadAvatar = async (avatarUri) => {
    try {
        const formData = new FormData();
        let filename = avatarUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : 'image/jpeg';

        // Ensure filename has an extension for the server to process correctly
        if (!match) {
            filename += '.jpg';
            type = 'image/jpeg';
        }

        console.log('Uploading Avatar:', { uri: avatarUri, filename, type, platform: Platform.OS }); // DEBUG

        if (Platform.OS === 'web') {
            // Web: Fetch blob from blob: URI
            const response = await fetch(avatarUri);
            const blob = await response.blob();
            // Force image/jpeg type if not present or generic
            const fileType = blob.type === 'application/octet-stream' || !blob.type ? 'image/jpeg' : blob.type;
            const finalBlob = blob.slice(0, blob.size, fileType);
            formData.append('avatar', finalBlob, filename);
        } else {
            // Mobile: Append object
            formData.append('avatar', {
                uri: avatarUri,
                name: filename,
                type,
            });
        }

        const response = await apiClient.post('api/profile/avatar', formData, {
            headers: {
                // Important: Do not set Content-Type manually. Let Axios/Browser set it with boundary.
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload Avatar Error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

export const sendEmailUpdateOTP = async (newEmail) => {
    try {
        const response = await apiClient.post('api/profile/email/send-otp', { newEmail });
        return response.data;
    } catch (error) {
        console.error('Send Email OTP Error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

export const verifyEmailUpdate = async (data) => {
    try {
        const response = await apiClient.post('api/profile/email/verify-otp', data);
        return response.data;
    } catch (error) {
        console.error('Verify Email OTP Error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};
