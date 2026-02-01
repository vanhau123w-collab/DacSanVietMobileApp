import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, sendPasswordResetOtp, resetPasswordWithOtp } from '../../services/authService';
import { updateProfile, changePassword, uploadAvatar, sendEmailUpdateOTP, verifyEmailUpdate, sendPhoneUpdateOtp, verifyPhoneUpdateOtp, sendPasswordChangeOtp, verifyPasswordChangeOtp } from '../../services/profileService';

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const data = await loginApi(username, password);
            console.log('AuthSlice Login Data:', JSON.stringify(data, null, 2)); // DEBUG JSON

            if (!data || !data.token) {
                // Check for nested structure: data.data.tokens.accessToken
                if (data?.data?.tokens?.accessToken) {
                    data.token = data.data.tokens.accessToken;
                    data.user = data.data.user;
                } else if (data?.data?.token) {
                    // Fallback for previous structure just in case
                    data.token = data.data.token;
                    data.user = data.data.user;
                } else {
                    throw new Error('Invalid response structure: Token missing');
                }
            }

            await AsyncStorage.setItem('jwt_token', data.token);
            if (data.user) {
                await AsyncStorage.setItem('user_info', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('AuthSlice Login Error:', error);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await AsyncStorage.removeItem('jwt_token');
            await AsyncStorage.removeItem('user_info');
            return true;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

// Update Profile Thunk
export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (updateData, { rejectWithValue }) => {
        try {
            const data = await updateProfile(updateData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Update failed');
        }
    }
);

// Change Password Thunk
export const changeUserPassword = createAsyncThunk(
    'auth/changePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const data = await changePassword(currentPassword, newPassword);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Change password failed');
        }
    }
);

// Upload Avatar Thunk
export const uploadUserAvatar = createAsyncThunk(
    'auth/uploadAvatar',
    async (avatarUri, { rejectWithValue }) => {
        try {
            const data = await uploadAvatar(avatarUri);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Avatar upload failed');
        }
    }
);

// Send Email OTP Thunk
export const sendEmailOtp = createAsyncThunk(
    'auth/sendEmailOtp',
    async (newEmail, { rejectWithValue }) => {
        try {
            const data = await sendEmailUpdateOTP(newEmail);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

// Verify Email Change Thunk
export const verifyEmailChange = createAsyncThunk(
    'auth/verifyEmailChange',
    async ({ newEmail, otpCode, otpToken }, { rejectWithValue }) => {
        try {
            const data = await verifyEmailUpdate({ newEmail, otpCode, otpToken });
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to verify OTP');
        }
    }
);

// Send Phone OTP Thunk
export const sendPhoneOtp = createAsyncThunk(
    'auth/sendPhoneOtp',
    async (newPhone, { rejectWithValue }) => {
        try {
            const data = await sendPhoneUpdateOtp(newPhone);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send Phone OTP');
        }
    }
);

// Verify Phone Change Thunk
export const verifyPhoneChange = createAsyncThunk(
    'auth/verifyPhoneChange',
    async ({ newPhone, otpCode, otpToken }, { rejectWithValue }) => {
        try {
            const data = await verifyPhoneUpdateOtp({ newPhone, otpCode, otpToken });
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to verify Phone OTP');
        }
    }
);

// Send Password Change OTP Thunk
export const sendPasswordChangeOtpThunk = createAsyncThunk(
    'auth/sendPasswordChangeOtp',
    async (currentPassword, { rejectWithValue }) => {
        try {
            const data = await sendPasswordChangeOtp(currentPassword);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

// Verify Password Change Thunk
export const verifyPasswordChange = createAsyncThunk(
    'auth/verifyPasswordChange',
    async ({ currentPassword, newPassword, otpCode, otpToken }, { rejectWithValue }) => {
        try {
            const data = await verifyPasswordChangeOtp({ currentPassword, newPassword, otpCode, otpToken });
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to verify OTP');
        }
    }
);

// Send Password Reset OTP Thunk
export const sendResetOtp = createAsyncThunk(
    'auth/sendResetOtp',
    async (email, { rejectWithValue }) => {
        try {
            const data = await sendPasswordResetOtp(email);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

// Reset Password with OTP Thunk
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const data = await resetPasswordWithOtp(email, otp, newPassword);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);


export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            const userInfo = await AsyncStorage.getItem('user_info');
            if (token) {
                return { token, user: userInfo ? JSON.parse(userInfo) : null };
            }
            return rejectWithValue('No token found');
        } catch (error) {
            return rejectWithValue('Failed to load user');
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user; // Ensure backend returns 'user'
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });

        // Load User
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the API returns the updated user object in action.payload.data.user
                // Based on the user's test script: response.data.data.user
                if (action.payload?.data?.user) {
                    state.user = action.payload.data.user;
                    AsyncStorage.setItem('user_info', JSON.stringify(state.user));
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changeUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.loading = false;
                // Password changed successfully
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload Avatar
            .addCase(uploadUserAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadUserAvatar.fulfilled, (state, action) => {
                state.loading = false;
                // Update user avatar in state
                if (action.payload?.data?.user) {
                    state.user = action.payload.data.user;
                    AsyncStorage.setItem('user_info', JSON.stringify(state.user));
                }
            })
            .addCase(uploadUserAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify Phone Change
            .addCase(verifyPhoneChange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPhoneChange.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data?.user) {
                    state.user = action.payload.data.user;
                    AsyncStorage.setItem('user_info', JSON.stringify(state.user));
                }
            })
            .addCase(verifyPhoneChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
