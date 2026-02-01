import apiClient from './apiClient';

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('api/auth/login', { username, password });
        console.log('Login API Response:', response.data); // DEBUG LOG
        return response.data;
    } catch (error) {
        console.error('Login API Error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

export const register = async (email, username, password, fullName) => {
    try {
        const response = await apiClient.post('api/auth/send-registration-otp', {
            email,
            username,
            password,
            fullName
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const verifyOtp = async (email, otp, username, password, fullName, role) => {
    try {
        const response = await apiClient.post('api/auth/verify-registration-otp', {
            email,
            otpCode: otp,
            username,
            password,
            fullName,
            role
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const resendOtp = async (email) => {
    try {
        const response = await apiClient.post('api/auth/send-registration-otp', { email }); // Check API if this is correct endpoint for resend, Kotlin code used same endpoint for register? 
        // Wait, the Kotlin code:
        // @POST("api/auth/send-registration-otp")
        // Call<AuthResponse> resendOtp(@Body ResendOtpRequest request);
        // And ResendOtpRequest only had email.
        // So yes, it seems it re-uses the endpoint or there is a specific one. Kotlin interface uses same URL.
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const sendPasswordResetOtp = async (email) => {
    try {
        const response = await apiClient.post('api/auth/send-password-reset-otp', { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
    try {
        const response = await apiClient.post('api/auth/reset-password-otp', { email, otp, newPassword });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
